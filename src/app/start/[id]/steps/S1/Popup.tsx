import LNQR from '@/app/board/[id]/my/components/LNQR';
import * as Dialog from '@radix-ui/react-dialog';


export default function PopupLN({ lnurl, setOpen, open }: Readonly<{ lnurl: string | null, open: boolean, setOpen: (open: boolean) => void }>) {
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
                borderRadius: 50,
                padding: 20,
                zIndex: 101,
                display: "flex",
                flexDirection: "column",
            }}>
                <Dialog.Title style={{
                    textAlign: "center",
                    marginBottom: "2rem",
                }}>Connexion Lightning</Dialog.Title>


                <LNQR key={lnurl ?? "placeholder"} lnurl={lnurl ?? "azertyuioplkjhgfdsqwxcvbn,nbvcdfty"} show={!!lnurl} disableShadow />
                <Dialog.Close className="primary" style={{
                    margin: "3rem 20px 15px"
                }}>OK</Dialog.Close>

            </Dialog.Content>
        </Dialog.Root>
    )
}