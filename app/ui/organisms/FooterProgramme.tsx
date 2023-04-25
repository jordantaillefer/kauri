import { DeleteButton } from "~/ui/molecules/DeleteButton"
import { SubmitButton } from "~/ui/molecules/SubmitButton"

export function FooterProgramme(props: { selectedItemId: string }) {
  return (
    <footer className="container p-0">
      <div className="flex h-16 items-center justify-between border-t-2 border-primary md:space-x-6">
        <SubmitButton value="modifier-date">Modifier la date</SubmitButton>
        <SubmitButton value="dupliquer-seance">Dupliquer la seance</SubmitButton>
        <DeleteButton value="supprimer-seance" hiddenProps={{ selectedItemIndex: props.selectedItemId }}>
          Supprimer la seance
        </DeleteButton>
      </div>
    </footer>
  )
}
