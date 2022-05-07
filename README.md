# NFT P2E Project - Happy Virus

- 지갑 연결하면 NFT 정보 조회
- 게임에 사용할 때 "사용 중에는 컨트랙트에 NFT가 옮겨집니다. 회수를 요청하시면 다시 돌려드립니다." 안내
- NFT 전송 허용하면 NFT 주소를 파이어베이스 해당 계정 노드와 Zone 노드에 저장(TimeStamp, Property, Zone)
- Claim : 해당 NFT의 TimeStamp 값을 호출하여 지급 가능 개수 전달 -> claim된 human 코인만큼 timestamp 차감 (유저 지갑에 human 코인 전송(가스비))
- Swap : 1 Human의 가치=(전체 Human 코인 개수 /보상풀 내에 존재하는 클레이) 보상풀로 human전송 <-> Klay 지급 
- 매달 스왑 비율 고지

## 스마트 컨트랙트 빌드

> truffle migrate --compile-all --reset --network klaytn

## NODE 모듈 설치

> npm install

## frontend 실행

> npm run dev

## 버전정보(Lecture)

> node 버전: 16.13.0

> npm 버전: 8.1.4

> truffle 버전: 5.1.23

> solidity 버전: 0.5.16

## 강좌 Reference URL

> [Inflearn Klaytn 클레이튼 블록체인 어플리케이션 만들기 - NFT](https://www.inflearn.com/course/%ED%81%B4%EB%A0%88%EC%9D%B4%ED%8A%BC-%EB%B8%94%EB%A1%9D%EC%B2%B4%EC%9D%B8-%EC%96%B4%ED%94%8C%EB%A6%AC%EC%BC%80%EC%9D%B4%EC%85%98-ERC721/dashboard)
> =======
