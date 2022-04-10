import { Caver } from 'caver-js';
import { Spinner } from 'spin.js';
import addImage from './add-image';
'use strict'

const config = {
  rpcURL: "https://api.baobab.klaytn.net:8651",
};
// const cav = new Caver(config.rpcURL);
// const yttContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
// const tsContract = new cav.klay.Contract(
//   DEPLOYED_ABI_TOKENSALES,
//   DEPLOYED_ADDRESS_TOKENSALES
// );

var ipfsClient = require("ipfs-http-client");
var ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const App = {
  auth: {
    accessType: "keystore",
    keystore: "",
    password: "",
  },

  //#region 계정 인증

  start: async function () {
    this.loadGameMap;
    const walletFromSession = sessionStorage.getItem("walletInstance");
    if (walletFromSession) {
      try {
        cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
        this.changeUIWithKeystore(JSON.parse(walletFromSession));
      } catch (e) {
        sessionStorage.removeItem("walletInstance");
      }
    }
  },

  loadGameMap: function () {
    addImage();
  },

  handleImport: async function () {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0]);
    fileReader.onload = (event) => {
      try {
        if (!this.checkValidKeystore(event.target.result)) {
          $("#message").text("유효하지 않은 keystore 파일입니다.");
          return;
        }
        this.auth.keystore = event.target.result;
        $("#message").text("keystore 통과. 비밀번호를 입력하세요.");
        document.querySelector("#input-password").focus();
      } catch (event) {
        $("#message").text("유효하지 않은 keystore 파일입니다.");
        return;
      }
    };
  },

  handlePassword: async function () {
    this.auth.password = event.target.value;
  },

  handleLogin: async function () {
    if (this.auth.accessType === "keystore") {
      try {
        const privateKey = cav.klay.accounts.decrypt(
          this.auth.keystore,
          this.auth.password
        ).privateKey;
        this.integrateWallet(privateKey);
      } catch (e) {
        $("#message").text("비밀번호가 일치하지 않습니다.");
      }
    }
  },

  handleMetaMask: async function () {
    if (typeof window.ethereum !== "undefined") {
      console.log("MetaMask is installed!");
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account = accounts[0];
      // caver-js 연결
      const _web3 = new Web3(window.ethereum);
      // caver 함수 중 현재 공개키의 klay양을 리턴하는 함수
      const balance = await _web3.ethereum.getBalance(account);
      console.log(balance);
      const privateKey = _web3.walletInstance;
      this.integrateWallet(privateKey);
    } catch (e) {
      console.error(error);
    }
  },

  handleKaikas: async function () {
        // 현재 브라우저가 kaikas가 사용되는지 확인
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
    } else {
      // 브라우저 익스텐션 설치 안내
    }
    try {
      let isKaikasUnlocked = klaytn._kaikas.isUnlocked()
      isKaikasUnlocked
        .then(async function (isUnlocked) {
          // kaikas와 상호작용해서 모든 공개키 획득
          // accounts[0] 같이 배열로 접근하여 사용가능
          const accounts = await window.klaytn.enable();
          // 현재 kaikas에 선택된 공개키
          const account = await window.klaytn.selectedAddress;
          console.log(account);

          // caver-js 연결
          const caver = new Caver(window.klaytn);
          // caver 함수 중 현재 공개키의 klay양을 리턴하는 함수
          const balance = await caver.klay.getBalance(account);
          console.log(balance);
          this.changeUIWithWallet(account);
        })
        .catch(async (error) => {
          const accounts = await window.klaytn.enable();
          // 현재 kaikas에 선택된 공개키
          const account = await window.klaytn.selectedAddress;
          console.log(account);

          // caver-js 연결
          const caver = new Caver(window.klaytn);
          // caver 함수 중 현재 공개키의 klay양을 리턴하는 함수
          const balance = await caver.klay.getBalance(account);
          console.log(balance);
          this.changeUIWithWallet(account);
        });
    } catch (error) {
      console.error(error);
    }

    klaytn.on('accountsChanged', function(accounts) {
      this.changeUIWithWallet(account);
    })
  },

  handleLock: function() {
    this.checkUnlocked().then(true)
      .catch(error => {
        return false;
      })
  },

  checkUnlocked : async () => {
      // 지갑이 연결되어있다면 true, 아니라면 false를 리턴합니다.
      const isUnlocked = await window.klaytn._kaikas.isUnlocked();
    return new Promise(function (resolve, reject) {
      resolve(true);
      })
    },

  handleLogout: async function () {
    this.removeWallet();
    location.reload();
  },

  getWallet: function () {
    if (cav.klay.accounts.wallet.length) {
      return cav.klay.accounts.wallet[0];
    }
  },

  checkValidKeystore: function (keystore) {
    const parsedKeystore = JSON.parse(keystore);

    const isValidKeystore =
      parsedKeystore.version &&
      parsedKeystore.id &&
      parsedKeystore.address &&
      parsedKeystore.keyring;

    return isValidKeystore;
  },

  integrateWallet: function (privateKey) {
    const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
    cav.klay.accounts.wallet.add(walletInstance);
    sessionStorage.setItem("walletInstance", JSON.stringify(walletInstance));
    this.changeUIWithKeystore(walletInstance);
  },

  reset: function () {
    this.auth = {
      keystore: "",
      password: "",
    };
  },

  changeUIWithKeystore: async function (walletInstance) {
    $("#loginModal").modal("hide");
    $("#login").hide();
    $("#logout").show();
    $(".afterLogin").show();
    $("#address").append(
      "<br>" + "<p>" + "내 계정 주소: " + walletInstance.address + "</p>"
    );
    await this.displayMyTokens(walletInstance.address);
    // await this.displayAllTokens(walletInstance);
    // await this.checkApproval(walletInstance);
  },

  changeUIWithWallet: async function (account) {
    $("#loginModal").modal("hide");
    $("#login").hide();
    $("#kaikas").hide();
    $("#metamask").hide();
    $("#logout").show();
    $(".afterLogin").show();
    $("#address").append("<br>" + "<p>" + "내 계정 주소: " + account + "</p>");
    await this.displayMyTokens(account);
    // await this.displayAllTokensWithWallet(account);
    // await this.checkApprovalWithWallet(account);
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
    sessionStorage.removeItem("walletInstance");
    this.reset();
  },

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target);
  },
  //#endregion

  displayMyTokens: async function (account) {
    var balance = parseInt(await this.getBalanceOf(account));

    if (balance === 0) {
      $("#myTokens").text("현재 보유한 토큰이 없습니다");
    } else {
      for (var i = 0; i < balance; i++) {
        (async () => {
          var tokenId = await this.getTokenOfOwnerByIndex(account, i);
          var tokenUri = await this.getTokenUri(tokenId);
          var metadata = await this.getMetadata(tokenUri);
          this.renderMyTokens(tokenId, metadata);
        })();
      }
    }
  },

  renderMyTokens: function (tokenId, metadata) {
    var tokens = $("#myTokens");
    var template = $("#MyTokensTemplate");
    this.getBasicTemplate(template, tokenId, metadata);

    tokens.append(template.html());
  },

  getERC721MetadataSchema: function (description, title, imgUrl) {
    return {
      title: "Asset Metadata",
      type: "object",
      properties: {
        name: {
          type: "string",
          description: description,
        },
        description: {
          type: "string",
          description: title,
        },
        image: {
          type: "string",
          description: imgUrl,
        },
      },
    };
  },

  getBalanceOf: async function (address) {
    return await caverExtKas.rpc.klay.getBalance(address);
    // return await ostContract.methods.balanceOf(address).call();
  },

  getTokenOfOwnerByIndex: async function (address, index) {
    return await caverExtKas.kas.kip17.getTokenListByOwner(address);
    // return await ostContract.methods.tokenOfOwnerByIndex(address, index).call();
  },

  getTokenUri: async function (tokenId) {
    return await ostContract.methods.tokenURI(tokenId).call();
  },

  getOwnerOf: async function (tokenId) {
    return await ostContract.methods.ownerOf(tokenId).call();
  },

  getNft: async function (tokenId) {
    return await ostContract.methods.getNft(tokenId).call();
  },

  getTotalSupply: async function () {
    return await ostContract.methods.totalSupply().call();
  },

  getTokenByIndex: async function (index) {
    return await ostContract.methods.tokenByIndex(index).call();
  },

  getMetadata: function (tokenUri) {
    return new Promise((resolve) => {
      $.getJSON(tokenUri, (data) => {
        resolve(data);
      });
    });
  },

  getBasicTemplate: function (template, tokenId, metadata) {
    template.find(".panel-heading").text("#" + tokenId);
    template.find("img").attr("src", metadata.properties.image.description);
    template
      .find("img")
      .attr("title", metadata.properties.description.description);
    template.find(".title").text(metadata.properties.name.description);
    template
      .find(".description")
      .text(metadata.properties.description.description);
    // template.find(".author").text(ytt[0]);
    // template.find(".date-created").text(ytt[1]);
  },
};

window.App = App;

window.addEventListener("load", function () {
  App.start();
  $("#tabs").tabs().css({ overflow: "auto" });
});

var opts = {
  lines: 10, // The number of lines to draw
  length: 30, // The length of each line
  width: 17, // The line thickness
  radius: 45, // The radius of the inner circle
  scale: 1, // Scales overall size of the spinner
  corners: 1, // Corner roundness (0..1)
  color: "#5bc0de", // CSS color or array of colors
  fadeColor: "transparent", // CSS color or array of colors
  speed: 1, // Rounds per second
  rotate: 0, // The rotation offset
  animation: "spinner-line-fade-quick", // The CSS animation name for the lines
  direction: 1, // 1: clockwise, -1: counterclockwise
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  className: "spinner", // The CSS class to assign to the spinner
  top: "50%", // Top position relative to parent
  left: "50%", // Left position relative to parent
  shadow: "0 0 1px transparent", // Box-shadow for the lines
  position: "absolute", // Element positioning
};
