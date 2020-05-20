import React, { useState, useEffect} from 'react';
import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
import { Input, Button, Row, Col } from 'reactstrap';

function Layout() {
    const [fileName, setFileName] = useState("")
    const [inputPath, setPath] = useState("")
    const [pathPoints, setPathPoints] = useState([])
    const [finalPlotPoints, setFinalPlotPoints] = useState([])
    const [crossedPoints, setCrossedPoints] = useState([])
    const [endPointX, setEndPointX] = useState(0)
    const [endPointY, setEndPointY] = useState(0)
    const [screenOriginY, setScreenOriginY] = useState(500)
    let screenOriginX = 500, stepSize = 10

    let fileReader

    const handleFileRead = (e) => {
        setPath("")
        const content = fileReader.result
        setPath(content)
    }

    const handleFile = (e) => {
        e.preventDefault()
        if(e.target.files[0] !== undefined) {
            //Read file content and set "path" state
            setFileName(e.target.files[0].name)
            fileReader = new FileReader()
            fileReader.onloadend = handleFileRead
            fileReader.readAsText(e.target.files[0])
        } else {
            setFileName("")
            setPath("")
        }
    }

    function onClick(e) {
        if( (fileName !== "") &&  (inputPath !== "") ){
            let s = {"path": inputPath}
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(s)
            };
            let url = 'http://localhost:8000/getTurtlePath'
            fetch(url,requestOptions)
            .then(res => res.json())
            .then((data) => {  
              setPathPoints(data["pathPoints"])
            })
            .catch(console.log)   
        } else
            alert('Select a valid file that contains the Turtle path')
    }

    useEffect(() => {
        let pointsArr = []
        let circlesArr = []
        for(let i=0;i<pathPoints.length;i++) {
            pointsArr.push(stepSize*pathPoints[i].point.x)
            pointsArr.push(-1*stepSize*pathPoints[i].point.y)
            if(pathPoints[i].isFirstPass == false) {
                let crossedPointData = {x: stepSize*pathPoints[i].point.x, y: -1*stepSize*pathPoints[i].point.y}
                circlesArr.push(crossedPointData)             
            }
        }
        setFinalPlotPoints(pointsArr)
        setCrossedPoints(circlesArr)
        if(pathPoints.length > 0) {
            setEndPointX(pathPoints[pathPoints.length-1].point.x)
            setEndPointY(pathPoints[pathPoints.length-1].point.y)
            //sort path points by y coordinate, we need this to set the screen origin
            pathPoints.sort((a,b) => parseInt(a.point.y)-parseInt(b.point.y))    
            pathPoints.length > 0 ? setScreenOriginY( 25 + (stepSize*pathPoints[pathPoints.length-1].point.y) ) : setScreenOriginY(500)
        }
    }, [pathPoints])    

    return(
        <div>
            <Input onChange={(e) => handleFile(e)} className="button" type="file" name="file" id="exampleFile" />
            <Button onClick={(e) => onClick(e)}>Generate Path</Button>
            <Row>
                <Col xs="3">
                    {pathPoints.length > 0 &&
                        <div className="result">
                            <h4 style={{textAlign: "left", color: "green"}}>Start Point: (0,0)</h4>
                            <h4 style={{textAlign: "left", color: "red"}}>End Point: ({endPointX},{endPointY})</h4>
                        </div>
                    }
                </Col>
                <Col xs="auto">
                    <Stage width={window.innerWidth} height={1000}>
                        <Layer>
                            <Line
                                x={screenOriginX}
                                y={screenOriginY}
                                points={finalPlotPoints}
                                stroke="white"
                            />
                            {crossedPoints.map((point, i) => (
                                <Circle key={`entity-${i}`} x={screenOriginX+point.x} y={screenOriginY+point.y} radius={2} fill="blue" />
                            ))}                    
                            <Circle x={screenOriginX} y={screenOriginY} radius={5} fill={finalPlotPoints.length>0 ? "green" : "black"} />
                            <Circle x={screenOriginX+finalPlotPoints[finalPlotPoints.length-2]} y={screenOriginY+finalPlotPoints[finalPlotPoints.length-1]} radius={5} fill={finalPlotPoints.length>0 ? "red" : "black"} />
                        </Layer>
                    </Stage>    
                </Col>     
            </Row>
        </div>
    )
}

export default Layout