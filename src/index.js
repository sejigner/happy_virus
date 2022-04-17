import Caver from "caver-js";
import CaverExtKAS from "caver-js-ext-kas";
import "./style.css";
import { Spinner } from "spin.js";
import { addMap } from "./handle-map";
import { divideMap } from "./handle-map";

const config = {
  rpcURL: "https://api.baobab.klaytn.net:8651",
};

const accessKeyId = "KASKU7Q44KX5YYU3Z4CICRT9";
const secretAccessKey = "V-U2Cd5bg9OAdYU8gbXb1YSh9nqI2g4e10joLZgp";
// Cypress 8217 Baobab 1001
const chainId = 8217;
// NFT 발행 후 NFT 컨트랙트 address 입력
// Krafterspace : 0x9faccd9f9661dddec3971c1ee146516127c34fc1
// KIP17 API를 활용해 조회하려면, 해당 계정이 배포한 컨트랙트만 조회가능합니다.
const nftAddress = "0x9faccd9f9661dddec3971c1ee146516127c34fc1";

const cav = new Caver(config.rpcURL);
const caverExtKas = new CaverExtKAS(chainId, accessKeyId, secretAccessKey);

// const ostContract = new cav.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);
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
    accessType: "kaikas",
    walletAddress: "",
  },

  //#region 계정 인증

  start: async function () {
    if (sessionStorage.getItem("isLogout") === "false") {
      try {
        if (typeof window.klaytn !== "undefined") {
          const provider = window["klaytn"];
          const account = await provider.selectedAddress;
          console.log("account status: " + account);
          if (typeof account !== "undefined") {
            this.changeUIWithWallet(account);
          } else {
            this.handleLogout();
          }
        } else {
          this.handleLogout();
        }
      } catch (e) {
        console.log(e);
      }
    }
    // if (walletFromSession) {
    //   try {
    //     cav.klay.accounts.wallet.add(JSON.parse(walletFromSession));
    //     this.changeUIWithKeystore(JSON.parse(walletFromSession));
    //   } catch (e) {
    //     sessionStorage.removeItem("walletInstance");
    //   }
    // }
  },

  // integrateWallet: function (privateKey) {
  //   const walletInstance = cav.klay.accounts.privateKeyToAccount(privateKey);
  //   cav.klay.accounts.wallet.add(walletInstance);
  //   sessionStorage.setItem("walletInstance", JSON.stringify(walletInstance));
  //   this.changeUI(walletInstance);
  // },

  loadGameMap: function () {
    addMap();
    divideMap();
  },

  // handleImport: async function () {
  //   const fileReader = new FileReader();
  //   fileReader.readAsText(event.target.files[0]);
  //   fileReader.onload = (event) => {
  //     try {
  //       if (!this.checkValidKeystore(event.target.result)) {
  //         $("#message").text("유효하지 않은 keystore 파일입니다.");
  //         return;
  //       }
  //       this.auth.keystore = event.target.result;
  //       $("#message").text("keystore 통과. 비밀번호를 입력하세요.");
  //       document.querySelector("#input-password").focus();
  //     } catch (event) {
  //       $("#message").text("유효하지 않은 keystore 파일입니다.");
  //       return;
  //     }
  //   };
  // },

  // handlePassword: async function () {
  //   this.auth.password = event.target.value;
  // },

  // handleLogin: async function () {
  //   if (this.auth.accessType === "keystore") {
  //     try {
  //       const privateKey = cav.klay.accounts.decrypt(
  //         this.auth.keystore,
  //         this.auth.password
  //       ).privateKey;
  //       this.integrateWallet(privateKey);
  //     } catch (e) {
  //       $("#message").text("비밀번호가 일치하지 않습니다.");
  //     }
  //   }
  // },

  // handleMetaMask: async function () {
  //   if (typeof window.ethereum !== "undefined") {
  //     console.log("MetaMask is installed!");
  //   }
  //   try {
  //     const accounts = await ethereum.request({
  //       method: "eth_requestAccounts",
  //     });
  //     const account = accounts[0];
  //     // caver-js 연결
  //     const _web3 = new Web3(window.ethereum);
  //     // caver 함수 중 현재 공개키의 klay양을 리턴하는 함수
  //     const balance = await _web3.ethereum.getBalance(account);
  //     console.log(balance);
  //     const privateKey = _web3.walletInstance;
  //     this.integrateWallet(privateKey);
  //   } catch (e) {
  //     console.error(error);
  //   }
  // },

  handleKaikas: async function () {
    if (typeof window["klaytn"] !== "undefined") {
      if (typeof window.klaytn !== "undefined") {
        // const provider = window["klaytn"];
        console.log("klaytn extension exists.");
      } else {
        // 브라우저 익스텐션 설치 안내
      }
      try {
        let isKaikasUnlocked = klaytn._kaikas.isUnlocked();
        isKaikasUnlocked
          .then(async function (isUnlocked) {
            const account = await window.klaytn.selectedAddress;
            if (await klaytn._kaikas.isEnabled()) {
              sessionStorage.setItem("isLogout", false);
            }
            this.changeUIWithWallet(account);
          })
          .catch(async (error) => {
            console.log(error);
            const accounts = await window.klaytn.enable();
            // 현재 kaikas에 선택된 공개키
            const account = await window.klaytn.selectedAddress;
            this.auth.walletAddress = account;
            this.changeUIWithWallet(account);
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("카이카스 지갑 확장 프로그램을 먼저 설치해주세요.");
    }
  },

  handleLogout: async function () {
    sessionStorage.setItem("isLogout", "true");
    document.getElementById("wallet-address").innerHTML = "";
    document.getElementById("wallet-address").style.display = "none";
    this.auth.walletAddress = "";
    this.removeWallet();
    location.reload();
  },

  changeUIWithWallet: async function (account) {
    document.getElementById("login").style.display = "none";
    document.getElementById("logout").style.display = "inline";
    document.getElementsByClassName("afterLogin")[0].style.display = "block";
    document.getElementById("wallet-address").style.display = "block";
    document.getElementById("wallet-address").innerHTML = account;
    await this.displayMyTokens(account);

    // $("#wallet-address").append("<br>" + "<p>" + "내 계정 주소: " + account + "</p>");
    // await this.displayAllTokensWithWallet(account);
    // await this.checkApprovalWithWallet(account);
  },

  removeWallet: function () {
    cav.klay.accounts.wallet.clear();
  },

  showSpinner: function () {
    var target = document.getElementById("spin");
    return new Spinner(opts).spin(target);
  },
  //#endregion

  displayMyTokens: async function (account) {
    let balance = 0;
    try {
      // const tokenList = await this.getTokenListByOwner(nftAddress, account);
      const tokenList = await caverExtKas.kas.tokenHistory.getNFTListByOwner(
        nftAddress,
        account
      );
      balance = tokenList.items.length;
      if (balance === 0) {
        document.getElementById("myTokens").innerHTML =
          "현재 보유한 토큰이 없습니다";
      } else {
        for (var i = 0; i < balance; i++) {
          (async () => {
            let token = tokenList.items[i];
            let tokenId = token.tokenId;
            let tokenUri = token.tokenUri;
            let metadata = await this.getMetadata(tokenUri);
            this.renderMyTokens(tokenId, metadata);
          })();
        }
      }
    } catch (e) {
      console.log(e);
    }
  },

  renderMyTokens: function (tokenId, metadata) {
    let tokens = document.getElementById("myTokens");
    let template = document.getElementById("MyTokensTemplate");
    this.getBasicTemplate(tokenId, metadata);

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

  getTokenListByOwner: async function (address, owner) {
    // getTokenListByOwner(addressOrAlias, owner) address : the contract address of the NFT
    return await caverExtKas.kas.kip17.getTokenListByOwner(address, owner);
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
      fetch(tokenUri)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          resolve(data);
        });
      // $.getJSON(tokenUri, (data) => {
      //   resolve(data);
      // });
    });
  },

  getBasicTemplate: function (tokenId, metadata) {
    document.getElementsByClassName("card-title").innerHTML =
      metadata.name.description;
    document.getElementsByClassName("card-img-top").src =
      metadata.image.description;
    document.getElementsByClassName("token-id").innerHTML = "#" + tokenId;
    document.getElementsByClassName("token-description").innerHTML =
      metadata.description.description;

    // template.find(".card-title").text("#" + tokenId);
    // template.find("img").attr("src", metadata.properties.image.description);
    // template
    //   .find("img")
    //   .attr("title", metadata.properties.description.description);
    // template.find(".title").text(metadata.properties.name.description);
    // template.find(".video-id").text(metadata.properties.name.description);
    // template
    //   .find(".description")
    //   .text(metadata.properties.description.description);
    // template.find(".author").text(ytt[0]);
    // template.find(".date-created").text(ytt[1]);
  },
};

window.App = App;

window.addEventListener("load", function () {
  try {
    App.start();
    App.loadGameMap();
    let tab = document.getElementById("tabs");
    tab.style.overflow = "auto";
  } catch (e) {
    console.log(e);
  }
});

// klaytn.on("accountsChanged", function (accounts) {
//   if
//   try {
//     App.changeUIWithWallet(accounts[0])
//   } catch (e) {
//     console.log(e)
//   }
// });

// window.onbeforeunload = function (event) {
// }

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
