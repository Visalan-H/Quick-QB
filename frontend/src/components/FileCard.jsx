import '../styles/FileCard.css';

const FileCard = ({ file, index = 0 }) => {
    const animationDelay = `${index * 0.1}s`;

    return (
        <div className="file-card" style={{ animationDelay }}>
            <div className="file-header">
                <h3>{file.subCode}</h3>
                <span className="content-type">{file.contentType}</span>
            </div>
            <div className="file-content">
                <p>Subject Code: {file.subCode}</p>
            </div>
            <div className="file-footer">
                <a href={file.fileURL} target="_blank" rel="noopener noreferrer" className="view-btn">
                    View PDF
                </a>
            </div>
        </div>
    );
};

export default FileCard;
