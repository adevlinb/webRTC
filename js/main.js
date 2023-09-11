let peerConnection;
let localStream;
let remoteStream;

const userOneVid = document.getElementById("user-1");
const userTwoVid = document.getElementById("user-2");
const offerSDP = document.getElementById("offer-sdp");
const answerSDP = document.getElementById("answer-sdp");
const createOfferBTN = document.getElementById("create-offer").addEventListener("click", createOffer)

let googleSTUN = {
    iceServers: [
        { urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"] }
    ]
}

init();
async function init() {
    console.log("init")
    localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: false});
    userOneVid.srcObject = localStream;

}

async function createOffer() {
    peerConnection = new RTCPeerConnection(googleSTUN);

    remoteStream = new MediaStream();
    userTwoVid.srcObject = remoteStream;

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    })

    peerConnection.ontrack = async function(event) {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        })
    }

    peerConnection.onicecandidate = async function(event) {
        if (event.candidate) offerSDP.value = JSON.stringify(peerConnection.localDescription);
    }

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    offerSDP.value = JSON.stringify(offer)


}

async function createAnswer() {
    peerConnection = new RTCPeerConnection(googleSTUN);

    remoteStream = new MediaStream();
    userTwoVid.srcObject = remoteStream;

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    })

    peerConnection.ontrack = async function(event) {
        event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
        })
    }

    peerConnection.onicecandidate = async function(event) {
        if (event.candidate) answerSDP.value = JSON.stringify(peerConnection.localDescription);
    }

    
}