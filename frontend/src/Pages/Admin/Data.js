import React, { Component } from 'react';
import { UplodeDataFile, get_user_files } from '../../utils';
import { Modal, Button } from 'react-bootstrap';
class Data extends Component {
    constructor(props) {
        super(props);
        this.state = {
            label: '',
            file: null,
            files: [],
            showModal: false,
            deleteFileId: null,
        };
    }

    componentDidMount() {
        get_user_files().then(response => {
            let { body, status } = response;
            if (status === 200) {
                this.setState({
                    files: [...body].reverse()
                })
            } else {

            }
        });
    }
    handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value,
        });
    };

    handleFileChange = (event) => {
        this.setState({
            file: event.target.files[0],
        });
    };

    handleSubmit = (event) => {
        console.log(this.state.label, this.state.file)
        event.preventDefault();
        UplodeDataFile(this.state.label, this.state.file).then(response => {
            let { body, status } = response;
            console.log(body, status)

        });
    };
    handleDownload(id) {
        // make API call to download file with given id
        window.open(`/api/file/${id}/download/`, '_blank');
    }

    handleDelete(id) {
        this.setState({ showModal: true, deleteFileId: id });
    }

    confirmDelete() {
        const id = this.state.deleteFileId;
        // make API call to delete file with given id
        fetch(`/api/file/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${localStorage.getItem('access')}`
            }
        })
            .then(response => {
                if (response.ok) {
                    // remove file from state if delete was successful
                    const updatedFiles = this.state.files.filter(file => file.id !== id);
                    this.setState({ files: updatedFiles, showModal: false, deleteFileId: null });
                } else {
                    throw new Error('Failed to delete file');
                }
            })
            .catch(error => console.error(error));
    }

    cancelDelete() {
        this.setState({ showModal: false, deleteFileId: null });
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-md-9">
                        <div className="table-responsive">
                            <table className="table table-striped table-hover table-light">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Label</th>
                                        <th>Status</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.files.map((file, index) => (
                                        <tr key={file.id}>
                                            <td>{index + 1}</td>
                                            <td>{file.label}</td>
                                            <td>{file.status}</td>
                                            <td>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => this.handleDownload(file.id)}
                                                >
                                                    Download
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => this.handleDelete(file.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Modal show={this.state.showModal} onHide={() => this.cancelDelete()}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Confirm Delete</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>Are you sure you want to delete this file?</Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => this.cancelDelete()}>
                                        Cancel
                                    </Button>
                                    <Button variant="danger" onClick={() => this.confirmDelete()}>
                                        Delete
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-3">
                        <div className="card text-dark bg-light mb-4">
                            <div className="card-header">Uplode File</div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="labelInput">Label</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="labelInput"
                                            name="label"
                                            value={this.state.label}
                                            onChange={this.handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="fileInput">File</label>
                                        <input
                                            type="file"
                                            className="form-control-file"
                                            id="fileInput"
                                            name="file"
                                            onChange={this.handleFileChange}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success">
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Data;