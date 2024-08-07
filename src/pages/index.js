import { useRef, useState } from "react";
import { useFormik } from 'formik';
import { Col, Container, Row } from 'reactstrap';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import ViewAllGames from "./components/viewAllGames";

const validate = values => {
        let errors = {}
        //es cambiante los campos
        return errors
}

const Database = () => {

        //useStates
        const [camposExtras, setCamposExtras] = useState([])
        let refCamposExtras = useRef([])
        const [disableWrong1, setDisableWrong1] = useState(false)
        const [disableWrong2, setDisableWrong2] = useState(false)
        const [disableWrong3, setDisableWrong3] = useState(false)
        const [title, setTitle] = useState("");

        //modal states
        const [show, setShow] = useState(false);

        const handleClose = () => setShow(false);
        const handleShow = () => setShow(true);

        const onSubmit = async values => {
                console.log('form data', values)
                //debi enviar los valores como un objecto por cada 3 elementos, y no de manera unica, esto se puede mejorarr despues
                await axios.post(process.env.REACT_APP_API_URL + '/save', values);
        }

        //initial values
        const initialValues = {
                word1: "",
                score1: "",
                word2: "",
                score2: "",
                show1: false,
                show2: false
        }

        const formik = useFormik({
                enableReinitialize: false,
                validateOnChange: true,
                initialValues,
                onSubmit,
                validate,
        })

        const selectGame = async (data) => {
                let element_count = Object.keys(data).length / 3
                formik.setFieldValue(`word1`, data.word1)
                formik.setFieldValue(`score1`, data.score1)
                formik.setFieldValue(`show1`, false)
                formik.setFieldValue(`word2`, data.word2)
                formik.setFieldValue(`score2`, data.score2)
                formik.setFieldValue(`show2`, false)
                //Primero elimina
                setCamposExtras([])
                refCamposExtras.current = []
                //Luego agrega
                for (let i = 2; i < element_count; i++) {
                        await handleAdd(data[`word${i + 1}`], data[`score${i + 1}`])
                }
        }

        const handleAdd = async (word = "", score = "") => {
                setCamposExtras([...refCamposExtras.current, ''])
                refCamposExtras.current = [...refCamposExtras.current, '']
                formik.setFieldValue(`word${refCamposExtras.current.length + 2}`, word)
                formik.setFieldValue(`score${refCamposExtras.current.length + 2}`, score)
                formik.setFieldValue(`show${refCamposExtras.current.length + 2}`, false)
        }

        const handleRemove = async (index) => {
                const nuevosCampos = [...refCamposExtras.current];
                nuevosCampos.splice(index, 1);
                setCamposExtras(nuevosCampos)
                refCamposExtras.current = nuevosCampos
                formik.setValues(eliminarCampo(formik.values, index + 2))
        }

        const eliminarCampo = (objeto, indice) => {
                const nuevoObjeto = { ...objeto };
                delete nuevoObjeto[`word${indice}`];
                delete nuevoObjeto[`score${indice}`];
                delete nuevoObjeto[`show${indice}`];

                // Recorrer los siguientes campos hacia atrás y ajustar sus índices
                for (let i = indice + 1; i <= Math.floor(Object.keys(objeto).length / 3); i++) {
                        if (objeto.hasOwnProperty(`word${indice}`)) {
                                nuevoObjeto[`word${i - 1}`] = nuevoObjeto[`word${i}`];
                                nuevoObjeto[`score${i - 1}`] = nuevoObjeto[`score${i}`];
                                nuevoObjeto[`show${i - 1}`] = nuevoObjeto[`show${i}`];
                                delete nuevoObjeto[`word${i}`];
                                delete nuevoObjeto[`score${i}`];
                                delete nuevoObjeto[`show${i}`];
                        }
                }

                return nuevoObjeto;
        };

        //handle reset
        const resetBuzz = async () => {
                await axios.get(process.env.REACT_APP_API_URL + '/reset_buzz')
        }
        //show Wrong
        const showWrong = async (number) => {
                switch (number) {
                        case 1:
                                setDisableWrong1(!disableWrong1)
                                break;
                        case 2:
                                setDisableWrong2(!disableWrong2)
                                break;
                        case 3:
                                setDisableWrong3(!disableWrong3)
                                break;
                        default:
                                break;
                }
                await axios.post(process.env.REACT_APP_API_URL + '/wrong', { wrong: (!disableWrong1 && !disableWrong2 && !disableWrong3) ? number : 0 })
        }

        const handleResetTags = async () => {
                await axios.get(process.env.REACT_APP_API_URL + '/reset_new')
        }

        return <>
                <div style={{ position: "fixed", backgroundColor: "black", top: 0, height: "100%", width: "100%", zIndex: -1 }}></div>
                <Col xl={6} className="form-style-5 scrollbar" style={{ display: "flex", justifyContent: "center", width: "100%", height: "100vh" }}>
                        <Col xl={3} xs={0}></Col>
                        <Container>
                                <Row>Selected Game: </Row>
                                <Row>{title}</Row>
                                <Row style={{ paddingBottom: "2rem", paddingTop: "2rem" }}>
                                        <Col>Please input the values of the game</Col>
                                        <Col><Button variant="danger" onClick={handleResetTags}>Reset New Tags</Button></Col>
                                        <Col>
                                                <Button variant="primary" onClick={handleShow}>
                                                        Select Game
                                                </Button>
                                        </Col>
                                        <ViewAllGames show={show} handleClose={handleClose} selectGame={selectGame} setTitle={setTitle} formik={formik}></ViewAllGames>
                                </Row>
                                <form onSubmit={formik.handleSubmit}>
                                        <Row>

                                                <Col md={2} sm={2} xs={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <div className="checkbox-wrapper-8">
                                                                <input type="checkbox" className="tgl tgl-skewed" id="1" onChange={() => (formik.setFieldValue("show1", !formik.values.show1))} checked={formik.values.show1} />
                                                                <label htmlFor="1" className="tgl-btn" data-tg-off="Hidden" data-tg-on="Visible"></label>
                                                        </div>
                                                </Col>
                                                <Col md={6} sm={6} xs={6}>
                                                        <label htmlFor="word1">Word</label>
                                                        <input type='text' id="word1" name="word1" onChange={formik.handleChange} value={formik.values.word1}></input>
                                                </Col>
                                                <Col md={2} sm={2} xs={2}>
                                                        <label htmlFor="score1">Score</label>
                                                        <input type='text' id="score1" name="score1" onChange={formik.handleChange} value={formik.values.score1}></input>
                                                </Col>

                                        </Row>
                                        <Row>
                                                <Col md={2} sm={2} xs={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <div className="checkbox-wrapper-8">
                                                                <input type="checkbox" className="tgl tgl-skewed" id="2" onChange={() => (formik.setFieldValue("show2", !formik.values.show2))} checked={formik.values.show2} />
                                                                <label htmlFor="2" className="tgl-btn" data-tg-off="Hidden" data-tg-on="Visible"></label>
                                                        </div>
                                                </Col>
                                                <Col md={6} sm={6} xs={6}>
                                                        <label htmlFor="word2">Word</label>
                                                        <input type='text' id="word2" name="word2" onChange={formik.handleChange} value={formik.values.word2}></input>
                                                </Col>
                                                <Col md={2} sm={2} xs={2}>
                                                        <label htmlFor="score2">Score</label>
                                                        <input type='text' id="score2" name="score2" onChange={formik.handleChange} value={formik.values.score2}></input>
                                                </Col>
                                                <Col md={2}></Col>
                                        </Row>

                                        {camposExtras.map((campo, index) => (
                                                <div key={index}>
                                                        <Row>
                                                                <Col md={2} sm={2} xs={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                        <div className="checkbox-wrapper-8">
                                                                                <input id={index + 3} type="checkbox" className="tgl tgl-skewed" onChange={() => (formik.setFieldValue(`show${index + 3}`, !formik.values[`show${index + 3}`]))} checked={formik.values[`show${index + 3}`]}>
                                                                                </input>
                                                                                <label className="tgl-btn" data-tg-off="Hidden" data-tg-on="Visible" htmlFor={index + 3}></label>
                                                                        </div>
                                                                </Col>
                                                                <Col md={6} sm={6} xs={6}>
                                                                        <label htmlFor={"word" + (index + 3)}>Word</label>
                                                                        <input type='text' id={"word" + (index + 3)} name={"word" + (index + 3)} onChange={formik.handleChange} value={formik.values[`word${index + 3}`] || ""}></input>
                                                                </Col>
                                                                <Col md={2} sm={2} xs={2}>
                                                                        <label htmlFor={"score" + (index + 3)}>Score</label>
                                                                        <input type='text' id={"score" + (index + 3)} name={"score" + (index + 3)} onChange={formik.handleChange} value={formik.values[`score${index + 3}`] || ""}></input>
                                                                </Col>
                                                                <Col md={2} sm={2} xs={2}>
                                                                        <button type="button" className="remove" onClick={() => handleRemove(index)}>
                                                                                -
                                                                        </button>
                                                                </Col>
                                                        </Row>
                                                </div>
                                        ))}

                                        <Row>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                        <button type="button" style={{ backgroundColor: "hsl(150 100% 69%)", fontWeight: "bolder", padding: "0px 10px" }} onClick={() => handleAdd()}>
                                                                +
                                                        </button>
                                                </div>
                                        </Row>
                                        <br></br>
                                        <Row>
                                                <Col>
                                                        <button type="button" onClick={() => showWrong(1)} style={disableWrong1 ? { backgroundColor: "#808080", color: "white" } : { backgroundColor: "#ed4337", color: "white" }} >
                                                                First Wrong!
                                                        </button>
                                                </Col>
                                                <Col>
                                                        <button type="button" onClick={() => showWrong(2)} style={disableWrong2 ? { backgroundColor: "#808080", color: "white" } : { backgroundColor: "#ed4337", color: "white" }} >
                                                                Second Wrong!
                                                        </button>
                                                </Col>
                                                <Col>
                                                        <button type="button" onClick={() => showWrong(3)} style={disableWrong3 ? { backgroundColor: "#808080", color: "white" } : { backgroundColor: "#ed4337", color: "white" }} >
                                                                Third Wrong!
                                                        </button>
                                                </Col>
                                                <Col>
                                                        <button type="button" onClick={resetBuzz} style={{ backgroundColor: "#fd7e14", color: "white" }}>
                                                                RESET BUZZ
                                                        </button></Col>
                                        </Row>
                                        <br></br>
                                        <Row>
                                                <button type="submit" className='glowing-btn'><span className='glowing-txt'>U<span className='faulty-letter'>PD</span>ATE TABLE</span></button>
                                        </Row>
                                </form>
                                <Row>

                                </Row>
                        </Container>
                        <Col xl={3} xs={0}></Col>
                </Col></>
}

export default Database