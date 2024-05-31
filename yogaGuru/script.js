// set global - needed for external libraries
// global ml5; 

console.log('Hello World!');

const message = document.querySelector("#message")
const numbers = document.querySelector("#numbers")
const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const audio = document.getElementById("audio")
var timeElm = document.getElementById('timer');
const cur = document.querySelector("#cur");
// var learn = document.getElementById("learn").src;
var id = 1;
var x = 0;

var curr_pose;

audio.pause();

function play() {
    if (audio.paused) {
        audio.currentTime = 0
        audio.play();
    }
    else {
        audio.play()
    }
}

timer = setInterval(() => {
    if (audio.paused) {
        x = 0;
    }
    ++x;
    // console.log(x);
    timeElm.innerHTML = `${x-1} seconds`
}, 1000);

let poses = []
let poseNet
let neuralNetwork


function startApp(){
    ctx.strokeStyle = 'red';
    ctx.fillStyle = "red";
    ctx.lineWidth = 3;
    ctx.translate(640, 0);
    ctx.scale(-1, 1)

    initWebcam()
    
    neuralNetwork = ml5.neuralNetwork({ task: 'classification' })

    const modelInfo = {
        model: './model/model.json',
        metadata: './model/model_meta.json',
        weights: './model/model.weights.bin',
    }

    neuralNetwork.load(modelInfo, yogaModelLoaded)
}

function yogaModelLoaded() {
    message.innerHTML = "Yoga model loaded"
    poseNet = ml5.poseNet(video, "single", poseModelReady)
    poseNet.on("pose", gotPoses)
    drawCameraAndPoses()
}

function poseModelReady() {
    message.innerHTML = "Pose model loaded"
    poseNet.singlePose(video)
}

function gotPoses(results) {
    poses = results
}

function initWebcam() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
            video.srcObject = stream
            video.play()

            let stream_settings = stream.getVideoTracks()[0].getSettings()
            console.log('Width: ' + stream_settings.width)
            console.log('Height: ' + stream_settings.height)
        })
    }
}

function drawCameraAndPoses() {
    ctx.drawImage(video, 0, 0, 640, 480) // 640 x 360 or 640 x 480
    drawKeypoints()
    drawSkeleton()
    classifyKeyPoints()
    window.requestAnimationFrame(drawCameraAndPoses)
}

function drawKeypoints() {
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i += 1) {
        // For each pose detected, loop through all the keypoints
        for (let j = 0; j < poses[i].pose.keypoints.length; j += 1) {
            let keypoint = poses[i].pose.keypoints[j]
            // Only draw an ellipse is the pose probability is bigger than 0.2
            if (keypoint.score > 0.3) {
                ctx.beginPath()
                ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI)
                ctx.stroke()
            }
        }
    }
}

function drawSkeleton() {
    // Loop through all the skeletons detected
    for (let i = 0; i < poses.length; i += 1) {
        // For every skeleton, loop through all body connections
        for (let j = 0; j < poses[i].skeleton.length; j += 1) {
            let partA = poses[i].skeleton[j][0]
            let partB = poses[i].skeleton[j][1]
            ctx.beginPath()
            ctx.moveTo(partA.position.x, partA.position.y)
            ctx.lineTo(partB.position.x, partB.position.y)
            ctx.stroke()
        }
    }
}

function classifyKeyPoints(){
if(poses.length > 0) {
    let points = []
    for (let keypoint of poses[0].pose.keypoints) {
        points.push(Math.round(keypoint.position.x))
        points.push(Math.round(keypoint.position.y))
    }
    numbers.innerHTML = points.toString()
    neuralNetwork.classify(points, yogaResult)
}
}

function yogaResult(error, result) {
    if (error)
        console.error(error)
    //console.log(result[0].label + " confidence:" + result[0].confidence.toFixed(2))
    // message.innerHTML = `Pose: "${result[0].label}" --- confidence: ${result[0].confidence.toFixed(2)}`
    if (id == 5) {
        cur.innerHTML = 'tree';
        // document.getElementById(learn).src = 'https://youtu.be/sxymAjTuUx0';
        learn ="https://www.youtube.com/embed/sxymAjTuUx0"
        if (result[0].label == 'tree' && result[0].confidence > 0.90) {
            message.innerHTML = `${result[0].confidence}`;
            timer;
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
        }
    }
    else if (id == 1) {
        cur.innerHTML = 'goddess';
        if (result[0].label == 'goddess' && result[0].confidence > 0.90) {
            message.innerHTML = `${result[0].confidence}`;
            timer;
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
        }
    }
    else if (id == 2) {
        cur.innerHTML = 'downdog';
        if (result[0].label == 'downdog' && result[0].confidence > 0.80) {
            message.innerHTML = `${result[0].confidence}`;
            timer;
            console.log(timer);
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
    }
    }
    else if (id == 4) {
        cur.innerHTML = 'warrior2';
        if (result[0].label == 'warrior2' && result[0].confidence > 0.83) {
            message.innerHTML = `${result[0].confidence}`;
            timer;
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
    }
    }
    else if (id == 3) {
        cur.innerHTML = 'plank';
        if (result[0].label == 'plank' && result[0].confidence > 0.90) {
            message.innerHTML = `${result[0].confidence}`;
            timer;
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
    }
    }

    // console.log(id)
    console.log(result)
}


function setId() {
    globalThis.id = id + 1;
    if (id == 3) {
        document.getElementById("learn").src = "https://www.youtube.com/embed/Fcbw82ykBvY"
    }
    if (id == 4) {
        document.getElementById("learn").src = "https://www.youtube.com/embed/YSjBJDkA6zg"
    }
    if (id == 5) {
        document.getElementById("learn").src = "https://www.youtube.com/embed/sxymAjTuUx0"
    }
    if (id == 2) {
        document.getElementById("learn").src="https://www.youtube.com/embed/ahBd-oI76Zs"
    }
}



startApp()