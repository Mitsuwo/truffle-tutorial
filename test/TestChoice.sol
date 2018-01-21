pragma solidity ^0.4.11;
 import "truffle/Assert.sol";
 import "truffle/DeployedAddresses.sol";
 import "../private-tutor/contracts/Choice.sol";

contract TestChoice {
  Choice choice = Choice(DeployedAddresses.Choice());

  function testUserCanChooseTeacer() {
    uint returnedId = choice.choose(8);
    uint expected = 8;
    Assert.equal(returnedId, expected, "Choice of teacher ID 8 should be recorded.");
   }

  function testGetStudentAddressByTeacherId() {
    address expected = this;
    address student = choice.students(8);
    Assert.equal(student, expected, "Owner of teacher ID 8 should be recorded.");
   }

  function testGetStudentAddressByTeacherIdInArray() {
    address expected = this;
    address[16] memory students = choice.getStudents();
    Assert.equal(students[8], expected, "Owner of teacher ID 8 should be recorded.");
   }
}
