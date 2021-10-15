// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@chainlink/contracts/src/v0.6/VRFConsumerBase.sol";

contract RandomNumberConsumer is VRFConsumerBase {
    
  bytes32 internal keyHash;
  uint256 internal fee;
  uint256 public randomResult;
  event RequestedRandomness(bytes32 requestId);

  address public admin;

  mapping(uint256 => uint256) public rewardMultiplierPerType10factor;
  mapping(uint256 => uint256) public minValueByType;
  mapping(uint256 => uint256) public maxValueByType;

  uint256[6] previousDayResult;
  uint256[6] public currentDayResult;
  uint256 public totalPlayers;

  address public VFRC_address;
  

  uint public rewardTotalAmount;
  
  event BetResult(address participant, uint256 amountBet, uint256 amountWon);


  struct Bet{
    address userAddress;
    uint256 betType;
    uint256 bet;
    uint256 betAmount;
  }
  mapping( uint256 => Bet ) public bets;
 
  modifier onlyAdmin() {
    require(msg.sender == admin, "caller is not the admin");
    _;
  }

  modifier onlyVFRC() {
    require(msg.sender == VFRC_address, "only VFRC can call this function");
    _;
  }
  
  event Withdraw(address admin, uint256 amount);
  event Received(address indexed sender, uint256 amount);
  event Numbers(uint256 n1, uint256 n2, uint256 n3, uint256 n4, uint256 n5);
  event BetEvent(address userAddress, uint betType, uint bet, uint betAmount);
    
    /**
     * Constructor inherits VRFConsumerBase
     * 
     * Network: Kovan
     * Chainlink VRF Coordinator address: 0xdD3782915140c8f3b190B5D67eAc6dc5760C46E9
     * LINK token address:                0xa36085F69e2889c224210F603D836748e7dC0088
     * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
     */
    constructor(address _linkTokenAddress, bytes32 _keyHash, 
    address _vrfCoordinatorAddress, uint256 _fee)
        public
        VRFConsumerBase(
            _vrfCoordinatorAddress, // VRF Coordinator
            _linkTokenAddress  // LINK Token
        )
    {
      //starts reward array
      rewardMultiplierPerType10factor[1] = 180; //bet in group
      rewardMultiplierPerType10factor[2] = 36; //bet in group including all 5 results
    
      rewardMultiplierPerType10factor[3] = 600; //bet in decimal value
      rewardMultiplierPerType10factor[4] = 120; //bet in decimal value including all 5 results

      rewardMultiplierPerType10factor[3] = 5000; //bet in centena value
      rewardMultiplierPerType10factor[4] = 600; //bet in centena value including all 5 results

      // MINIMUM VALUES BY BET TYPE
      minValueByType[1] = 1;
      minValueByType[2] = 1;

      minValueByType[3] = 1;
      minValueByType[4] = 1;

      minValueByType[5] = 1;
      minValueByType[6] = 1;

      // MAXIMUM VALUES BY BET TYPE
      maxValueByType[1] = 25;
      maxValueByType[2] = 25;

      maxValueByType[3] = 100;
      maxValueByType[4] = 100;

      maxValueByType[5] = 1000;
      maxValueByType[6] = 1000;
      
      currentDayResult[0] = 1000;
      currentDayResult[1] = 2005;
      currentDayResult[2] = 3015;
      currentDayResult[3] = 4035;
      currentDayResult[4] = 5070;

      admin = msg.sender;
      totalPlayers = 0;
      rewardTotalAmount = 0;


      VFRC_address = _vrfCoordinatorAddress;
      keyHash = _keyHash;
      fee = _fee;
    }
    
    /** 
     * Requests randomness from a user-provided seed
     */
    function getRandomNumber() public returns (bytes32 requestId) {
        requestId = requestRandomness(keyHash, fee);
        emit RequestedRandomness(requestId);
        require(msg.sender == admin, "only admin must request random");
    }

    /** 
     * Requests the address of the Chainlink Token on this network 
     */
    function getChainlinkToken() public view returns (address) {
        return address(LINK);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 /* requestId */, uint256 randomness) internal override {
        randomResult = randomness;
        changeResult(randomResult);
    }

    /* Allows this contract to receive payments */
    receive() external payable {
      emit Received(msg.sender, msg.value);
    }

    /**
   * Withdraw LINK from this contract (admin option).
   */
    function withdrawLink(uint256 amount) external onlyAdmin {
      require(LINK.transfer(msg.sender, amount), "Error, unable to transfer");
    }

    /**
   * Withdraw Ether from this contract (admin option).
   */
    function withdrawEther(uint256 amount) external payable onlyAdmin {
      require(address(this).balance>=amount, "Error, contract has insufficent balance");
      uint withdrawableMoney = address(this).balance - rewardTotalAmount;
      require( withdrawableMoney >= amount, "withdrawn money should not interfere with bets");

      payable(admin).transfer(amount);
      emit Withdraw(admin, amount);
    }

    function bet(uint _betType, uint _value) public payable{
      require(msg.value >= 100, "bet amount must be greater than 100 wei");
      require((msg.value % 10) == 0, "bet amount must be greater a multiple of 10 wei to keep value bet intact");
      require(_value >= minValueByType[_betType] && _value <= maxValueByType[_betType], 'group must be a number between 1 and 25');
      
      uint currentBalance = address(this).balance;
      uint possibleReward = msg.value * rewardMultiplierPerType10factor[_betType] / 10;
      //require that contract has money to pay if user wins
      require( currentBalance >= rewardTotalAmount + possibleReward, "Error, contract has insufficent balance");
      
      rewardTotalAmount += possibleReward;
      //value subtraction is used to change value range from 1 -> 100 to 0 -> 99
      //may be better to handle this range change inside contract
      bets[totalPlayers] = Bet(msg.sender, _betType, _value - 1, msg.value);
      totalPlayers += 1;
      emit BetEvent(msg.sender, _betType, _value - 1, msg.value);
    }

    function payBets() public payable onlyVFRC {
      for(uint i = 0; i < totalPlayers; i += 1){
          uint userBetValue = bets[i].bet;
          uint userBetAmount = bets[i].betAmount;
          uint userBetType = bets[i].betType;
          if( verifyBet(userBetType, userBetValue) ){
            uint betSum = userBetAmount / 10;
            uint transferValue = rewardMultiplierPerType10factor[userBetType] * betSum;
            address payable pAddr = payable(bets[i].userAddress);
            pAddr.transfer(transferValue);
          }
          
          //delete bets[i];
      }


      totalPlayers = 0;
      rewardTotalAmount = 0;
    }

    function verifyBet(uint256 betType, uint256 betValue) internal onlyVFRC returns (bool betVerified) {
      if(betType == 1){ //group
        uint groupResult = ((currentDayResult[0] % 100) / 4);
        return betValue == groupResult;
      }else if(betType == 2){ //group 5
        uint groupResult1 = ((currentDayResult[0] % 100) / 4);
        uint groupResult2 = ((currentDayResult[1] % 100) / 4);
        uint groupResult3 = ((currentDayResult[2] % 100) / 4); 
        uint groupResult4 = ((currentDayResult[3] % 100) / 4);
        uint groupResult5 = ((currentDayResult[4] % 100) / 4);

        return betValue == groupResult1 || betValue == groupResult2 || betValue == groupResult3 || betValue == groupResult4 || betValue == groupResult5;
      }else if(betType == 3){ //dozen
        uint result = (currentDayResult[0] % 100);
        return betValue == result;
      }else if(betType == 4){ //dozen 5
        uint result1 = (currentDayResult[0] % 100);
        uint result2 = (currentDayResult[1] % 100);
        uint result3 = (currentDayResult[2] % 100); 
        uint result4 = (currentDayResult[3] % 100);
        uint result5 = (currentDayResult[4] % 100);

        return betValue == result1 || betValue == result2 || betValue == result3 || betValue == result4 || betValue == result5;
      }else if(betType == 5){ //centena 5
        uint result1 = (currentDayResult[0] % 1000);

        return betValue == result1;
      }else if(betType == 6){ //centena 5
        uint result1 = (currentDayResult[0] % 1000);
        uint result2 = (currentDayResult[1] % 1000);
        uint result3 = (currentDayResult[2] % 1000); 
        uint result4 = (currentDayResult[3] % 1000);
        uint result5 = (currentDayResult[4] % 1000);

        return betValue == result1 || betValue == result2 || betValue == result3 || betValue == result4 || betValue == result5;
      }
      else
        return false;
    }

    //maybe not a public function
    function changeResult(uint256 random) public onlyVFRC {
      //with the random number provided by chainlink, extract last 4 digits and remove'em after storing;
      // currentDayResult[0] = random % 10000;
      // random = random / 10000;
      // currentDayResult[1] = random % 10000;
      // random = random / 10000;
      // currentDayResult[2] = random % 10000;
      // random = random / 10000;
      // currentDayResult[3] = random % 10000;
      random = random / 10000;
      // currentDayResult[4] = random % 10000;

      emit Numbers( currentDayResult[0] + 1, currentDayResult[1] + 1, currentDayResult[2] + 1, currentDayResult[3] + 1, currentDayResult[4] + 1);

      payBets();
    }
}
