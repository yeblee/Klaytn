import Caver from "caver-js";

const config = {
  rpcURL: 'httpL//qpi.baobab.klaytn.net:8651'
}
const cav = new Caver(config.rpcURL);
//전역 상수 웹펙에서 세팅을 함.
const agContract = new cav.klay.agContract(DEPLOED_ABI, DEPLOYED_ADDRESS);
const App = {
  auth: {
    accessType: 'keystore',
    keystore: '',
    password: ''
  },

  start: async function () {
    const walletFromSessrion = sessionStorage.getItem('walletInstance');
    if (walletFromSessrion) {
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSessrion));
        this.changeUI(JSON.parse(walletFromSessrion));
      } catch (e) {
        sessionStorage.removeItem('walletInstance');
      }
    }
  },

  handleImport: async function () {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.filep0);
    fileReader.onload = (event) => {
      try {
        if (!this.checkValidKeystore(event.target.result)){
          $('#message').text('유효하지 않은 파일 입니다.');
          return ;
        }
        this.auth.keystore = event.target.result;
        $('#message').text('통과. 비밀번호를 입력하세요.');
        document.querySelector('#input-password').focus();
      } catch (event) {
        $('#message').text('유효하지 않은 파일 입니다.');
        return ;
      }
    }
  },

  handlePassword: async function () {
    this.auth.password = event.target.value;
  },
  // 비밀번호를 가져온다.
  handleLogin: async function () {
    if (this.auth.accessType == 'keystore') {
      try {
        const privatekey = cav.klay.accounts.decrypt(this.auth.keystore, this.auth.password).privateKey;
        this.integrateWallet(privatekey);
      } catch (e) {
        $('#message').text('비밀번호가 일치하지 않습니다.');
      }
    }
  },

  handleLogout: async function () {
    this.removeWallet();
    location.reload();
  },

  generateNumbers: async function () {

  },

  submitAnswer: async function () {

  },

  deposit: async function () {
    // 송금 하기 전 오너 정보인지 확인
    const walletInstance = this.getWallet();
    if (walletInstance) {
      if (await this.callOwner() != walletInstance.address) return;
      else {
        var amount = $('#amount').val();
        if (amount) {
          agContract.methods.deposit().send({
            from: walletInstance.address,
            gas: '250000',
            value: cav.utils.toPad(amount, "KLAY")
          })
          .once('transactionHash', (txHash) => {
            console.log(`txHash: $(txHash)`);
          })
          .once('receipt', (receipt) => {
            console.log(`(#${receipt.blockNumber})`, reseipt);
          })
          .once('error', (error) => {
            alert(error.message);
          });
        }
        return;
      }
    }
  },

  callOwner: async function () {
    return await agContract.methods.owner().call();
  },

  callContractBalance: async function () {

  },

  getWallet: function () {
    // 현재 계정 정보를 가져온다.
    if(cav.klay.accounts.wallet.length) {
      return cav.klay.accounts.wallet[0];
    }
  },

  checkValidKeystore: function (keystore) {
    const parsedKeystore = JSON.parse(keystore);
    const isValidKeystore = parsedKeystore.version &&
          parsedKeystore.id && parsedKeystore.address && parsedKeystore.cryto;
    return isValidKeystore;
  },

  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    cav.klay.accounts.wallet.add(walletInstance);
    // 계정이 로그인 된 상태를 계속 유지하기 위해서 사용.
    sessionStorage.setItem('walletInstance', JSON.stringify(walletInstance));
    this.changeUI(walletInstance);
  },

  reset: function () {
    this.auth = {
      keystore: '',
      password: ''
    };
  },

  changeUI: async function (walletInstance) {
    $('#loginModel').model('hide');
    $('#login').hide();
    $('#logout').show();
    $('#address').append('<br />' + '<p>' + '내 계정 주소: ' + walletInstance + '</p>');
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem('walletInstance');
    // auth를 초기화 시킨다.
    this.reset();
  },

  showTimer: function () {

  },

  showSpinner: function () {

  },

  receiveKlay: function () {

  }
};

window.App = App;

window.addEventListener("load", function () {
  App.start();
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: '#5bc0de', // CSS color or array of colors
  fadeColor: 'transparent', // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: 'spinner', // The CSS class to assign to the spinner
  top: '50%', // Top position relative to parent
  left: '50%', // Left position relative to parent
  shadow: '0 0 1px transparent', // Box-shadow for the lines
  position: 'absolute' // Element positioning
};