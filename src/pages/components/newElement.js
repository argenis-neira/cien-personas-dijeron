import { Col, Row } from 'reactstrap';
import { useFormik } from 'formik';

const NewElement = (props) => {

    const formik = useFormik({
        enableReinitialize: true,
        validateOnChange: true,
    })

    return <div>
        {
        Array.from({ length: props.array }, (_, index) => index + 3).map((number) => 
            <Row>
    <Col>
    <label htmlFor={"word"+number}>Word</label>
    <input type='text' id={"word"+number} name={"word"+number} onChange={formik.handleChange} value={formik.values["word"+number]}></input>
    </Col>
    <Col>
    <label htmlFor={"score" + number}>Score</label>
    <input type='text' id={"score" + number} name={"score" + number} ></input>
    </Col>
</Row>)
    }
    </div>
}

export default NewElement