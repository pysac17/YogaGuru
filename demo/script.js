// set global - needed for external libraries
/* globals ml5 */

const message = document.querySelector("#message")
const namePose = document.querySelector("#namePose")
const acc = document.querySelector("#acc")
const numbers = document.querySelector("#numbers")
const video = document.getElementById("video")
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
const audio = document.getElementById("audio")
var timeElm = document.getElementById('timer');


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

let poses = []
let poseNet
let neuralNetwork

let timer = function(x) {
    if(x === 30) {
        timeElm.innerHTML = 'DONEEE';
    }
    timeElm.innerHTML = x;
    return setTimeout(() => {timer(++x)}, 1000)
}


function startApp(){
    ctx.strokeStyle = 'red';
    ctx.fillStyle = "red";
    ctx.lineWidth = 3;
    ctx.translate(640, 0);
    ctx.scale(-1, 1)

    initWebcam()
    
    neuralNetwork = ml5.neuralNetwork({ task: 'classification' })

    const modelInfo = {
        model: './m2/model.json',
        metadata: './m2/model_meta.json',
        weights: './m2/model.weights.bin',
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

let id = 1;
function nextPose() {
    id+=1
}


function yogaResult(error, result) {
        if (error)
            console.error(error)
        //console.log(result[0].label + " confidence:" + result[0].confidence.toFixed(2))
        // message.innerHTML = `Pose: "${result[0].label}" --- confidence: ${result[0].confidence.toFixed(2)}`
    if (id == 1) {
        if (result[0].label == 'goddess' && result[0].confidence > 0.90) {
            message.innerHTML = 'goddess';
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
        }
        namePose.innerHTML = 'goddess';
    }
    else if (id == 2) {
        if (result[0].label == 'downdog' && result[0].confidence > 0.80) {
            message.innerHTML = 'downdog';
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
        }
        namePose.innerHTML = 'downdog';
    }
    else if (id == 3) {
        if (result[0].label == 'warrior2' && result[0].confidence > 0.83) {
            message.innerHTML = 'warrior2';
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
        }
        namePose.innerHTML = 'warrior2';
    }
    else if (id == 4) {
        if (result[0].label == 'plank' && result[0].confidence > 0.90) {
            message.innerHTML = 'plank';
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
        }
        namePose.innerHTML = 'plank';

    }
    if (id == 5) {
        if (result[0].label == 'tree' && result[0].confidence > 0.90) {
            message.innerHTML = 'tree';
            play();
        }
        else {
            message.innerHTML = 'NONEEE';
            audio.pause();
        }
                namePose.innerHTML = 'tree';

    }
    else if (id == 6) {
        if (result[0].label == 'garland' && result[0].confidence > 0.70) {
            message.innerHTML = 'garland';
            play();
        }
        else {
            message.innerHTML = `NONEEE`;
            audio.pause();
        }
        namePose.innerHTML = 'garland';

    }
    else if (id == 7) {
        if (result[0].label == 'halfmoon' && result[0].confidence > 0.80) {
            message.innerHTML = 'halfmoon';
            play();
        }
        else {
            message.innerHTML = `NONEEE`;
            audio.pause();
        }
        namePose.innerHTML = 'halfmoon';

    }
    else if (id == 8) {
        if (result[0].label == 'Triangle' && result[0].confidence > 0.70) {
            message.innerHTML = 'Triangle';
            play();
        }
        else {
            message.innerHTML = `NONEEE`;
            audio.pause();
        }
        namePose.innerHTML = 'Triangle';

    }
    else if (id == 9) {
        if (result[0].label == 'warrior' && result[0].confidence > 0.90) {
            message.innerHTML = 'warrior3';
            play();
        }
        else {
            message.innerHTML = `NONEEE`;
            audio.pause();
        }
        namePose.innerHTML = 'warrior3';

    }
    else if (id == 10) {
        if (result[0].label == 'Eagle' && result[0].confidence > 0.80) {
            message.innerHTML = 'Eagle';
            play();
        }
        else {
            message.innerHTML = `NONEEE`;
            audio.pause();
        }
        namePose.innerHTML = 'Eagle';

    }
    acc.innerHTML = result[0].confidence
    // console.log(result[0].label, result[0].confidence)
    }




startApp()