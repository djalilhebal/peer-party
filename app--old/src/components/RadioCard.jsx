/**
 * Radio Card.
 * @param {React.PropsWithChildren & name & onSelect} props 
 */
export default function RadioCard({ onSelect, name, children, ...props }) {
    return <>
        <label className="radiocard">
            {children}
            <input type="radio" name={name} onChange={onSelect} {...props} />
        </label>
    </>
}
