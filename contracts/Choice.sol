pragma solidity ^0.4.4;
 contract Choice {
   address[16] public students;

   function choose(uint teacherId) public returns(uint) {
     require(teacherId >= 0 && teacherId <= 15);

     students[teacherId] = msg.sender;
     return teacherId;
    }

   function getStudents() public returns (address[16]) {
     return students;
    }
 }
