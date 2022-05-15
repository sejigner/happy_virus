"use strict";

import Caver from "caver-js";
import CaverExtKAS from "caver-js-ext-kas";
import "./style.css";
import { Spinner } from "spin.js";
import { addMap } from "./handle-map";
import { divideMap } from "./handle-map";
import { get } from "http";

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

// var ipfsClient = require("ipfs-http-client");
// var ipfs = ipfsClient({
//   host: "ipfs.infura.io",
//   port: "5001",
//   protocol: "https",
// });

const Dummy = {
  region: {
    "1,1": 450000,
    "1,2": 116745000,
    "1,3": 475840000,
    "1,4": 2733113,
    "1,5": 3201130,
    "1,6": 2157245,
    "1,7": 214000,
    "1,8": 4847,
    "1,9": 450000,
    "1,10": 116745000,
    "1,11": 475840000,
    "1,12": 2733113,
    "2,1": 0,
    "2,2": 103452622,
    "2,3": 144700110,
    "2,4": 15620,
    "2,5": 3235035,
    "2,6": 50420013,
    "2,7": 675840000,
    "2,8": 52205593,
    "2,9": 3235035,
    "2,10": 50420013,
    "2,11": 675840000,
    "2,12": 52205593,
    "3,1": 0,
    "3,2": 0,
    "3,3": 26205266,
    "3,4": 6504,
    "3,5": 165284,
    "3,6": 2135,
    "3,7": 541,
    "3,8": 4658,
    "3,9": 165284,
    "3,10": 2135,
    "3,11": 541,
    "3,12": 4658,
    "4,1": 0,
    "4,2": 0,
    "4,3": 65,
    "4,4": 77,
    "4,5": 46,
    "4,6": 100,
    "4,7": 165284,
    "4,8": 165284,
    "4,9": 46,
    "4,10": 100,
    "4,11": 0,
    "4,12": 0,
    "5,1": 0,
    "5,2": 0,
    "5,3": 65,
    "5,4": 77,
    "5,5": 46,
    "5,6": 100,
    "5,7": 165284,
    "5,8": 165284,
    "5,9": 46,
    "5,10": 100,
    "5,11": 0,
    "5,12": 0,
    "6,1": 0,
    "6,2": 0,
    "6,3": 65,
    "6,4": 77,
    "6,5": 46,
    "6,6": 100,
    "6,7": 165284,
    "6,8": 165284,
    "6,9": 46,
    "6,10": 100,
    "6,11": 0,
    "6,12": 0,
  },
};

const App = {
  auth: {
    accessType: "kaikas",
    walletAddress: "",
    selectedNft: "",
    selectedNftImg: "",
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
        document.getElementById("tabContent").innerHTML =
          "현재 보유한 토큰이 없습니다";
      } else {
        const promise = new Promise((resolve, reject) => {
          for (let i = 0; i < balance; i++) {
            (async () => {
              const token = tokenList.items[i];
              const tokenId = token.tokenId;
              const tokenUri = token.tokenUri;
              const metadata = await this.getMetadata(tokenUri);
              this.renderNftList(tokenId, metadata);
            })();
          }
          resolve();
        });
        // promise
        //   .then(() => {
        //     const nftItems = document.getElementsByClassName("card");
        //     const numItem = nftItems.length;
        //     console.log(nftItems);
        //     console.log("length: " + numItem);

        //     for (let i = 0; i < numItem; i++) {
        //       console.log("isTesting");
        //       const btn = itemArr[i].querySelector(".btn-theme");

        //       console.log(btn);
        //       btn.addEventListener("click", (e) => {
        //         const selectedItem = "active";
        //         const tgt = e.target;
        //         console.log(tgt);
        //         if (tgt.classList.contains(selectedItem)) {
        //           this.auth.selectedItem = "";
        //           tgt.classList.remove(selectedItem);
        //         } else {
        //           this.auth.selectedItem =
        //             tgt.querySelector(".token-id").innerHTML;
        //           tgt.classList.add(selectedItem);
        //         }
        //       });
        //     }
        //   })
        //   .catch((e) => {
        //     console.log(e);
        //   });
      }
    } catch (e) {
      console.log(e);
    }
  },

  renderMyTokens: function (tokenId, metadata) {
    let tokens = document.getElementById("myTokens");
    let template = document.getElementById("MyTokensTemplate");
    this.getBasicTemplate(tokenId, metadata);
    tokens.appendChild(template);
  },

  renderNftList: function (tokenId, metadata) {
    if ("content" in document.createElement("template")) {
      // 기존 HTML tbody 와 템플릿 열로 테이블을 인스턴스화합니다.
      let m = document.querySelector("#grid-nft");
      let template = document.querySelector("#NftCardTemplate");

      // 새로운 열을 복제하고 테이블에 삽입합니다.
      let clone = template.content.cloneNode(true);
      clone.querySelector(".card-img-top").src = metadata.image;
      clone.querySelector(".card-title").innerHTML =
        "<strong>" + metadata.name + "</strong>";
      clone.querySelector(".token-id").innerHTML = tokenId;
      clone.querySelector(".token-description").innerHTML =
        metadata.description;
      clone.id = tokenId;

      console.log("isTesting");
      const card = clone.querySelector(".card");
      const selectedItem = "activeCard";

      card.addEventListener("click", (e) => {
        let str = this.auth.selectedNft;
        if (str === "") {
          card.classList.add(selectedItem);
          this.auth.selectedNft = tokenId;
          this.auth.selectedNftImg = metadata.image;
        } else if (tokenId === str) {
          card.classList.remove(selectedItem);
          this.auth.selectedNft = "";
          this.auth.selectedNftImg = "";
        } else {
          let preSelected = document.getElementsByClassName(selectedItem)[0];
          preSelected.classList.remove(selectedItem);
          card.classList.add(selectedItem);
          this.auth.selectedNft = tokenId;
          this.auth.selectedNftImg = metadata.image;
        }
        this.fetchRegionInfo();

        // if (card.classList.contains(selectedItem)) {
        //   this.auth.selectedItem = arr.filter((element) => {
        //     return element !== tokenId;
        //   });
        //   card.classList.remove(selectedItem);
        // } else {
        //   this.auth.selectedItem.push(tokenId);
        //   card.classList.add(selectedItem);
        // }
      });

      m.appendChild(clone);
    } else {
      // HTML 템플릿 엘리먼트를 지원하지 않으므로
      // 테이블에 열을 추가하는 다른 방법을 찾습니다.
    }
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

  fetchRegionInfo: function () {
    let test = document.getElementsByClassName("grid-item");
    const selectedNft = this.auth.selectedNft;
    const selectedNftImg = this.auth.selectedNftImg;
    const div = document.getElementById("no-nft");
    const img = document.getElementById("modal-nft-img");
    const btnInfect = document.getElementById("btn-infect");

    [].forEach.call(test, function (element) {
      element.onclick = function () {
        window.scrollTo(0, 0);
        document.body.classList.add("hidden");
        let id = element.id;
        let population = Dummy.region[id];
        if (population !== 0) {
          let modal = document.getElementById("modal");
          document.getElementById("modal-zone").innerHTML =
            "Zone" + " (" + id + ")";
          modal.style.display = "flex";

          if (selectedNft === "") {
            img.style.display = "none";
            img.src = "";
            div.style.display = "block";
            btnInfect.classList.add("inactive");
            const location = document.querySelector("#nft-container").offsetTop;
            div.addEventListener("click", () => {
              window.scrollTo({ top: location, behavior: "smooth" });
              document.body.classList.remove("hidden");
              modal.style.display = "none";
            });
          } else {
            div.style.display = "none";
            img.style.display = "block";
            img.src = selectedNftImg;
            btnInfect.classList.remove("inactive");
          }
          // alert("Left potential fans: " + population);
        }
      };
    });
  },

  getBasicTemplate: function (tokenId, metadata) {
    document.getElementsByClassName("card-title").innerHTML = metadata.name;
    document.getElementsByClassName("card-img-top").src = metadata.image;
    document.getElementsByClassName("token-id").innerHTML = "#" + tokenId;
    document.getElementsByClassName("token-description").innerHTML =
      metadata.description;

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
document.addEventListener("DOMContentLoaded", () => {
  console.log("hello world");

  let tabsBtn = document.getElementsByClassName("tab-btn");
  console.log(tabsBtn.length);
  for (let i = 0; i < tabsBtn.length; i++) {
    tabsBtn[i].addEventListener("click", (e) => {
      const tgt = e.target;
      const tab_id = tgt.getAttribute("data-tab");
      console.log(tab_id);
      document
        .getElementsByClassName("tab-btn is_on")[0]
        .classList.remove("is_on");
      document.getElementsByClassName("cont")[0].classList.remove("is_on");
      document.getElementsByClassName("cont")[1].classList.remove("is_on");

      tgt.classList.add("is_on");
      document.getElementById(tab_id).classList.add("is_on");
    });
  }
});

window.addEventListener("load", function () {
  try {
    App.start();
    App.loadGameMap();
    App.fetchRegionInfo();
  } catch (e) {
    console.log(e);
  }
});

const closeBtn = modal.querySelector(".close-area");
closeBtn.addEventListener("click", (e) => {
  modal.style.display = "none";
  document.body.classList.remove("hidden");
});

modal.addEventListener("click", (e) => {
  const evTarget = e.target;
  if (evTarget.classList.contains("modal-overlay")) {
    modal.style.display = "none";
    document.body.classList.remove("hidden");
  }
});

window.addEventListener("keyup", (e) => {
  if (modal.style.display === "flex" && e.key === "Escape") {
    modal.style.display = "none";
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
