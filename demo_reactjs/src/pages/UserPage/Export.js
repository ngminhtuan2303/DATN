import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { exportUsers } from '../../services/UserService';
import { toast } from 'react-toastify';


const ModalExport = (props) => {
    const { show, handleClose } = props;
    const [date, setDate] = useState("");

    const handleSaveUser = async () => {
        try {
            console.log(date)
            let res = await exportUsers(date);
            
            console.log(res)
            let csvContent = "data:text/csv;charset=utf-8,"
            csvContent += res.data
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");

            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "Export.csv");
            document.body.appendChild(link); // Required for FF

            link.click(); 
            handleClose();
            setDate('');
            toast.success("Export success!")

        } catch (err) {
            //error
            console.log(err)
            toast.error("An error ")
        }
    }

    // const [showModal, setShowModal] = useState(false);
    // const [image, setImage] = useState(null);
    // const handleShow = () => setShowModal(true);

    return <>
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Export </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='body-add-new'>
                    <div className="mb-3">
                        <label className="form-label">Date: </label>
                        <input type="datetime-local" className="form-control" value={date} onChange={(event) => setDate(event.target.value)} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={() => handleSaveUser()}>
                    Export
                </Button>
            </Modal.Footer>
        </Modal>
    </>
}

export default ModalExport;