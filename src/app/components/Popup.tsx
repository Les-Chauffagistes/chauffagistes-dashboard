import * as Dialog from '@radix-ui/react-dialog';


export default function Popup({ children, title, setOpen, open, handler = () => {} }: Readonly<{ title: string, children: React.ReactNode, open: boolean, setOpen: (open: boolean) => void, handler?: () => void }>) {

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Overlay style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.1)',
                backdropFilter: "blur(10px)",
                zIndex: 100
            }} className="DialogOverlay" />
            <Dialog.Content style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: "var(--card-background-color)",
                border: "solid 1px var(--card-outline-color)",
                borderRadius: 20,
                padding: 20,
                zIndex: 101,
                width: "80%",
                height: "80%",
                maxWidth: 400,
                maxHeight: 300,
                marginTop: 30,
                display: "flex",
                flexDirection: "column",
            }}>
                <Dialog.Title style={{ textAlign: "center", marginBottom: "2rem" }}>{title}</Dialog.Title>
                {children}
                <div style={{
                    margin: "auto 0px 0px auto",
                }}>
                    <Dialog.Close onClick={handler} className="primary">OK</Dialog.Close>
                </div>

            </Dialog.Content>
        </Dialog.Root>
    )
}