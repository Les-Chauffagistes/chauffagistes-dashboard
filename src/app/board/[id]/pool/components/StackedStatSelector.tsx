import { useState } from "react"
import "./stackedStatSelector.css"


export type OptionsType<T> = { displayName: string, optionName: T}[]
export default function StackedStatSelecteor<T>({ options, handler }: Readonly<{ options: OptionsType<T>, handler: (optionName: T) => void }>) {
    const [active, setActive] = useState(options[0].optionName)
    return (
        <div style={{
            border: "1px solid var(--card-outline-color)",
            backgroundColor: "var(--card-background-color)",
            borderRadius: 7,
            width: "fit-content",
            margin: "0 auto",
        }}>
            {options.map((item) => {
                return (
                    <button style={{
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                        backgroundColor: "transparent",
                        color: "var(--secondary-white-text-color)",
                        fontWeight: 200
                    }} className={item.optionName === active ? "active" : ""}
                        key={item.displayName} onClick={() => {
                            setActive(item.optionName)
                            handler(item.optionName)}
                        }>
                        {item.displayName}
                    </button>
                )
            })}
        </div>
    )
}