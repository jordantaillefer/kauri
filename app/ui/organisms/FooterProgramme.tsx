import { DeleteButton } from "~/ui/molecules/DeleteButton"
import { SubmitButton } from "~/ui/molecules/SubmitButton"

export function FooterProgramme(props: { selectedItemId: string }) {
  return (
    <footer className="container p-0">
      <div
        className="flex items-center justify-between h-16 border-t-2 border-primary md:space-x-6">
        <SubmitButton value="modifier-date">Modifier la date</SubmitButton>
        <SubmitButton value="duppliquer-seance">Dupliquer lea seance</SubmitButton>
        <DeleteButton value="supprimer-seance" hiddenProps={{ "selectedItemIndex": props.selectedItemId }}>Supprimer la seance</DeleteButton>
      </div>
    </footer>
  )
}