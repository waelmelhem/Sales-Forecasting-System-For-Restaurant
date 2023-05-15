import React, { Component } from 'react';
import { UplodeDataFile, download_file, get_user_files } from '../../utils';
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
            get_user_files().then(response => {
                let { body, status } = response;
                if (status === 200) {
                    this.setState({
                        files: [...body].reverse()
                    })
                } else {

                }
            });

        });
    };
    handleDownload(id, label) {
        const fileUrl = `http://127.0.0.1:8000/api/file/${id}/`;

        fetch(fileUrl, {
            headers: {
                Authorization: `JWT ${localStorage.getItem('access')}`, // Replace with your authentication token
            },
        })
            .then(response => {
                const filenameHeader = response.headers.get('Content-Disposition');
                const filename = `${label}.csv`

                return response.blob().then(blob => {
                    // Create a temporary URL for the blob object
                    const url = URL.createObjectURL(blob);

                    // Create a link element and simulate a click to trigger the download
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = filename;
                    link.click();

                    // Clean up the temporary URL
                    URL.revokeObjectURL(url);
                });
            })
            .catch(error => console.error(error));
    };
    handleDelete(id) {
        this.setState({ showModal: true, deleteFileId: id });
    }

    confirmDelete = (id) => {
        const url = `http://127.0.0.1:8000/api/file/${id}`;

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `JWT ${localStorage.getItem("access")}`
            },
        })
            .then(response => {
                console.log(response.body)
                if (response.ok) {
                    this.cancelDelete();
                    get_user_files().then(response => {
                        let { body, status } = response;
                        if (status === 200) {
                            this.setState({
                                files: [...body].reverse()
                            })
                        } else {

                        }
                    });
                } else {
                    // Handle error response
                    // You can parse the response body using response.json()
                }
            })
            .catch(error => {
                // Handle network or other errors
            });
    }

    cancelDelete() {
        this.setState({ showModal: false, deleteFileId: null });
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-md-9">
                        <div className="table-responsive" >
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
                                                    onClick={() => this.handleDownload(file.id, file.label)}
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
                                    <Button variant="danger" onClick={() => this.confirmDelete(this.state.deleteFileId)}>
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