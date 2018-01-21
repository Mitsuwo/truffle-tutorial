App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load teachers.
    $.getJSON('../teachers.json', function(data) {
      var teachersRow = $('#teachersRow');
      var teacherTemplate = $('#teacherTemplate');

      for (i = 0; i < data.length; i ++) {
        teacherTemplate.find('.panel-title').text(data[i].name);
        teacherTemplate.find('img').attr('src', data[i].picture);
        teacherTemplate.find('.teacher-subject').text(data[i].subject);
        teacherTemplate.find('.teacher-age').text(data[i].age);
        teacherTemplate.find('.teacher-location').text(data[i].location);
        teacherTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        teachersRow.append(teacherTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Choice.json', function(data) {
      var ChoiceArtifact = data;
      App.contracts.Choice = TruffleContract(ChoiceArtifact);
      App.contracts.Choice.setProvider(App.web3Provider);
      return App.markChoosed();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-choose', App.handleAdopt);
  },

  markChoosed: function(students, account) {
    var choiceInstance;
      App.contracts.Choice.deployed().then(function(instance) {
        choiceInstance = instance;
        return choiceInstance.getStudents.call();
      }).then(function(students) {
        for (i = 0; i < students.length; i++) {
          if (students[i] !== '0x0000000000000000000000000000000000000000') {
            $('.panel-teacher').eq(i).find('button').text('Success').attr('disabled', true);
          }
        }
      }).catch(function(err) {
        console.log(err.message);
      });
    },

  handleChoose: function(event) {
    event.preventDefault();

    var teacherId = parseInt($(event.target).data('id'));

    var choiceInstance;
     web3.eth.getAccounts(function(error, accounts) {
       if (error) {
         console.log(error);
       }

       var account = accounts[0];
       App.contracts.Choice.deployed().then(function(instance) {
         choiceInstance = instance;
         return choiceInstance.choose(teacherId, {from: account});
       }).then(function(result) {
         return App.markChoosed();
       }).catch(function(err) {
         console.log(err.message);
       });
     });
   }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
