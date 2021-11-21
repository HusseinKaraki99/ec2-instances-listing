import './Loader.css';
import { CircleProgress } from 'react-gradient-progress'


export function Loader() {
    return (
        <div className="loader">
            <div className="spin"></div>
        </div>

    );
}

export function ProgressLoader(props) {
    return (
        <div className="loader">
            <CircleProgress percentage={~~props.count} strokeWidth={3} fontSize={"35px"} width={150} />
            <div className="uploading">Uploading instances...</div>
        </div>

    );
}
