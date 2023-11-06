import { useState } from 'react';

/**
 * It is a **radio** input presented as a **card**.
 * 
 * A Wonderland component.
 *
 * Similar to:
 * - https://cauldron.dequelabs.com/components/RadioCardGroup
 * - https://helios.hashicorp.design/components/form/radio-card
 * 
 * @example
 * const [role, setRole] = useState('owner');
 * 
 * <RadioCardGroup
 *     name="role"
 *     radios={[
 *         {value: 'owner', content: 'Start'},
 *         {value: 'viewer', content: 'Join'},
 *     ]}
 *     onSelected={setRole}
 * />
 *
 */
export default function RadioCardGroup({radios, onSelected}: RadioCardGroupProps) {
    const [selectedRadio, setSelectedRadio] = useState<RadioCardOption | null>(null);

    function handleSelected(x: RadioCardOption) {
        setSelectedRadio(x);
        onSelected(x);
    }

    const els = radios.map(x => {
        const isChecked = selectedRadio === x;

        return (
            <label className="radio-card" key={x.value}>
                <span className="radio-card__content">
                    {x.content}
                </span>
                <span className="radio-card__control">
                    <input type="radio"
                        value={x.value}
                        checked={isChecked}
                        onChange={() => handleSelected(x) }
                        />
                </span>
            </label>
        );
    });

    return (
        <div className="radio-card-group">
            {els}
        </div>
    );
}

export interface RadioCardOption {
    content: any,
    value: any,
    selected?: boolean // TODO support default value
}

interface RadioCardGroupProps {
    name: string;
    radios: RadioCardOption[]
    onSelected: (x: RadioCardOption) => void
}
