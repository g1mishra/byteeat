import { Button} from "./ui/button";
import Link from "next/link";


type SidebarProps = {
    heading: string
    hrefsAndLinks: {href: string, text: string}[]
}

export const Sidebar: React.FC<SidebarProps> = ({heading, hrefsAndLinks}) => {
    return (
        <div className="flex flex-col pr-4">
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">{heading}</h2>
            <div className="space-y-1">
            {
                hrefsAndLinks.map(
                    (item) => (
                        <Link href={item.href}>
                        <Button variant="secondary" size="sm" className="w-full justify-start bg-transparent">
                            {item.text}
                        </Button>
                        </Link>
                    )
                )
            }

            </div>
        </div>
    )
}
