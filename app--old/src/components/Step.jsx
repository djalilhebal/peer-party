export default function Step({ completed = false, children }) {

    return (
        <div className={`step ${completed ? 'step--completed' : ''}`}>
            {children}
        </div>
    );

}
