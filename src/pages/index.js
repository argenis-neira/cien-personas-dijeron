import { useState } from "react";
import { useFormik } from 'formik';
import { Col, Row } from 'reactstrap';
import axios from 'axios';
// import NewElement from "./components/newElement";

const validate = values => {
        let errors = {}
        //es cambiante los campos
        return errors
}

const Database = () => {

        //useStates
        const [camposExtras, setCamposExtras] = useState([])

        const onSubmit = async values => {
                console.log('form data', values)
                //debi enviar los valores como un objecto por cada 3 elementos, y no de manera unica, esto se puede mejorarr despues
                const response = await axios.post('http://localhost:5000/save', values);
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

        //useEffects

        const handleAdd = () => {
                setCamposExtras([...camposExtras, ''])
                formik.setFieldValue(`word${camposExtras.length + 3}`, '')
                formik.setFieldValue(`score${camposExtras.length + 3}`, '')
                formik.setFieldValue(`show${camposExtras.length + 3}`, false)
        }

        const handleRemove = (index) => {
                const nuevosCampos = [...camposExtras];
                nuevosCampos.splice(index, 1);
                setCamposExtras(nuevosCampos)
                formik.setValues(eliminarCampo(formik.values, index + 3))
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
                await axios.get('http://localhost:5000/reset_buzz')
        }

        return <div className="form-style-5">
                <Row>Please input the values of the game</Row>
                <form onSubmit={formik.handleSubmit}>
                        <Row>

                                <Col md={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div className="checkbox-wrapper-8">
                                                <input type="checkbox" className="tgl tgl-skewed" id="1" onClick={() => (formik.setFieldValue("show1", !formik.values.show1))} />
                                                <label htmlFor="1" className="tgl-btn" data-tg-off="Hidden" data-tg-on="Visible"></label>
                                        </div>
                                </Col>
                                <Col md={4}>
                                        <label htmlFor="word1">Word</label>
                                        <input type='text' id="word1" name="word1" onChange={formik.handleChange} ></input>
                                </Col>
                                <Col md={4}>
                                        <label htmlFor="score1">Score</label>
                                        <input type='text' id="score1" name="score1" onChange={formik.handleChange}></input>
                                </Col>

                        </Row>
                        <Row>
                                <Col md={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div className="checkbox-wrapper-8">
                                                <input type="checkbox" className="tgl tgl-skewed" id="2" onClick={() => (formik.setFieldValue("show2", !formik.values.show2))} />
                                                <label htmlFor="2" className="tgl-btn" data-tg-off="Hidden" data-tg-on="Visible"></label>
                                        </div>
                                </Col>
                                <Col md={4}>
                                        <label htmlFor="word2">Word</label>
                                        <input type='text' id="word2" name="word2" onChange={formik.handleChange} ></input>
                                </Col>
                                <Col md={4}>
                                        <label htmlFor="score2">Score</label>
                                        <input type='text' id="score2" name="score2" onChange={formik.handleChange}></input>
                                </Col>
                                <Col md={2}></Col>
                        </Row>

                        {camposExtras.map((campo, index) => (
                                <div key={index}>
                                        <Row>
                                                <Col md={2} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                        <div className="checkbox-wrapper-8">
                                                                <input id={index + 3} type="checkbox" className="tgl tgl-skewed" onClick={() => (formik.setFieldValue(`show${index + 3}`, !formik.values[`show${index + 3}`]))}>
                                                                </input>
                                                                <label className="tgl-btn" data-tg-off="Hidden" data-tg-on="Visible" htmlFor={index + 3}></label>
                                                        </div>
                                                </Col>
                                                <Col md={4}>
                                                        <label htmlFor={"word" + (index + 3)}>Word</label>
                                                        <input type='text' id={"word" + (index + 3)} name={"word" + (index + 3)} onChange={formik.handleChange} value={formik.values[`word${index + 3}`] || ""}></input>
                                                </Col>
                                                <Col md={4}>
                                                        <label htmlFor={"score" + (index + 3)}>Score</label>
                                                        <input type='text' id={"score" + (index + 3)} name={"score" + (index + 3)} onChange={formik.handleChange} value={formik.values[`score${index + 3}`] || ""}></input>
                                                </Col>
                                                <Col md={2}>
                                                        <button type="button" className="remove" onClick={() => handleRemove(index)}>
                                                                Remove
                                                        </button>
                                                </Col>
                                        </Row>
                                </div>
                        ))}

                        <Row>
                                <button type="button" onClick={handleAdd}>
                                        Add
                                </button>
                        </Row>
                        <br></br>
                        <Row>
                                <button type="button" onClick={resetBuzz} style={{ backgroundColor: "#fd7e14" }}>
                                        RESET BUZZ
                                </button>
                        </Row>
                        <br></br>
                        <Row>
                                <button type="submit" className='glowing-btn'><span className='glowing-txt'>U<span className='faulty-letter'>PD</span>ATE TABLE</span></button>
                        </Row>
                </form>
                <Row>

                </Row>
        </div>
}

export default Database