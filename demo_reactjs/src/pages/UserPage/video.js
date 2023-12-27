import React, { useState, useRef, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
// import * as THREE from 'three';
import { Camera } from '@mediapipe/camera_utils';

import {
    FaceMesh,
    // FACEMESH_RIGHT_EYE,
    // FACEMESH_LEFT_EYE,
    // FACEMESH_LIPS,

    // FACEMESH_TESSELATION,
    FACEMESH_FACE_OVAL
} from '@mediapipe/face_mesh'
import { drawConnectors } from '@mediapipe/drawing_utils'
import '../../App.scss';
//import WebcamDemo from './FaceDetection';

const Video = ({ show, onHide }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    // const canvasRef2 = useRef(null);
    const [stream, setStream] = useState(null);
    const [image, setImage] = useState(null);

    const capture = () => {
        let ctx = canvasRef.current.getContext('2d');
        ctx.drawImage(videoRef.current, 0, 0, 480, 360);
        let imageSrc = canvasRef.current.toDataURL('image/jpeg');
        onHide(imageSrc);
    };

    const handleClose = () => {
        onHide(image ? image : null);
        setImage(null);
    }

    useEffect(() => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
            alert("enumerateDevices() not supported.");
            return;
        }
        navigator.mediaDevices
            .getUserMedia({ audio: false, video: true })
            .then((stream) => {
                setStream(stream);
            })
            .catch((err) => {
                console.log("The following error occurred: " + err);
            });

        const faceMesh = new FaceMesh({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
            }
        });

        const solutionOptions = {
            selfieMode: true,
            enableFaceGeometry: true,
            maxNumFaces: 1,
            refineLandmarks: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        };

        faceMesh.setOptions(solutionOptions)
        faceMesh.onResults(onResults);

        const camera = new Camera(videoRef.current, {
            onFrame: async () => {
                try {
                    await faceMesh.send({ image: videoRef.current });
                } catch (err) {
                    console.log("ÊRRRR")
                }

            },
            width: 1280,
            height: 720
        });
        camera.start();
        return () => {
            faceMesh.close()
            camera.stop()
        }

    }, []);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;

        }
    }, [videoRef, stream])

    function onResults(results) {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        canvasCtx.drawImage(
            results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
        if (results.multiFaceLandmarks) {
            for (const landmarks of results.multiFaceLandmarks) {
                drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, { color: 'red', lineWidth: 2 });

                const text_roll = `Nhin thang vao Camera`
                canvasCtx.beginPath();
                canvasCtx.font = '20px Courier New';
                canvasCtx.textAlign = 'left';
                canvasCtx.textBaseline = 'top';
                canvasCtx.fillStyle = 'red';
                // canvasCtx.fillText(text_yaw, 0, 0);
                // canvasCtx.fillText(text_pitch, 0, 30);
                canvasCtx.fillText(text_roll, 0, 5);
                canvasCtx.stroke();

            }

        }




        // if (results.multiFaceGeometry) {
        //     for (const facegeometry of results.multiFaceGeometry) {
        //         // const pt_matrix = facegeometry.getPoseTransformMatrix().getPackedDataList();
        //         // const pt_matrix_three_js_format = new THREE.Matrix4().fromArray(pt_matrix);
        //         // const euler_angles = new THREE.Euler().setFromRotationMatrix(pt_matrix_three_js_format, 'XYZ');
        //         // const pitch = THREE.MathUtils.radToDeg(euler_angles['x']);
        //         // const yaw = THREE.MathUtils.radToDeg(euler_angles['y']);
        //         // const roll = THREE.MathUtils.radToDeg(euler_angles['z']);
        //         // const text_yaw = `Yaw: ${yaw}`
        //         // const text_pitch = `Pitch: ${pitch}`
                


        //     }
        // }

        canvasCtx.restore();
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
                <Modal.Title>Capture photo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <video ref={videoRef} autoPlay muted className='input_video'></video>
                <canvas ref={canvasRef} className="output_canvas" width="480px" height="360px"></canvas>
                {/* <canvas ref={canvasRef2} hidden className="output_canvas" width="480px" height="360px"></canvas> */}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                {!image && (
                    <Button variant="primary" onClick={capture}>
                        Capture
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default Video;

