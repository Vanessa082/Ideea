"use client";

import { useState } from "react";
import { Plus, MoreVertical, Brain, BarChart3, CornerRightDown, Kanban } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../../ui/dropdown-menu";
import { NewBoardModal } from "../board/modal/new-board-modal";

// Template data (4 placeholders)
const TEMPLATE_PLACEHOLDERS = [
    { name: "Mind Map", subtext: "Idea Mapping", icon: Brain, iconColor: "text-[var(--chart-1)]" },
    { name: "Kanban Board", subtext: "Project Tracking", icon: Kanban, iconColor: "text-[var(--chart-2)]" },
    { name: "Flowchart", subtext: "Process Diagram", icon: CornerRightDown, iconColor: "text-[var(--chart-3)]" },
    { name: "Affinity Diagram", subtext: "Grouping Ideas", icon: BarChart3, iconColor: "text-[var(--chart-4)]" },
];

const CARD_HEIGHT_CLASSES = 'h-[260px] md:h-[280px]';


// Reusable card for both Blank Board and Templates
interface BoardCardProps {
    title: string;
    subtext?: string;
    onClick: () => void;
    icon: React.ReactNode;
    isDisabled?: boolean;
}

const BaseBoardCard: React.FC<BoardCardProps> = ({ title, subtext, onClick, icon, isDisabled = false }) => (
    <div
        onClick={isDisabled ? () => { } : onClick}

        className={`
            min-w-[100px] flex-1 basis-0
            ${CARD_HEIGHT_CLASSES}
            p-3 
            flex flex-col items-center justify-start 
            border border-border/80
            rounded-lg
            transition-all duration-150 ease-in-out
            ${isDisabled ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'cursor-pointer hover:shadow-xl hover:border-[var(--chart-1)]'}
        `}
    >
        <div className={`
            w-full h-3/4 
            rounded-md 
            bg-card 
            flex items-center justify-center
            border border-border/80
            mb-3
        `}>
            {icon}
        </div>

        <p className="text-base font-semibold text-center truncate w-full">{title}</p>
        {subtext && <p className="text-sm text-muted-foreground">{subtext}</p>}
    </div>
);


const MultiColorPlusIcon = () => (
    <div className="relative w-10 h-10 flex items-center justify-center">
        <Plus
            className="h-10 w-10 text-foreground"
            strokeWidth={3}
            style={{
                filter: `drop-shadow(0px 0px 0px var(--chart-1)) drop-shadow(1px 1px 0px var(--chart-2))`
            }}
        />
        <div className="absolute w-full h-full bg-gradient-to-br from-[#1f67da] via-[#34A853] to-[#FBBC05] rounded-full opacity-10 blur-sm" />
    </div>
);


export const BoardCreationSection = () => {
    const [isNewBoardModalOpen, setIsNewBoardModalOpen] = useState(false);
    const [isTemplatesVisible, setIsTemplatesVisible] = useState(true);

    const handleCreateBoard = () => setIsNewBoardModalOpen(true);
    const handleTemplateClick = (name?: string) => {
        toast.info(`The Template feature is currently under development.`, {
            description: name ? `Template "${name}" coming soon!` : "Template Gallery coming soon!",
        });
    };

    const TemplateGalleryActions = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                    <MoreVertical size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsTemplatesVisible(prev => !prev)}>
                    {isTemplatesVisible ? 'Hide templates' : 'Show templates'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    // This array will hold all cards (Blank Board + 4 Templates = 5 items)
    const allCards = [
        <BaseBoardCard
            key="blank"
            title="Blank Board"
            onClick={handleCreateBoard}
            icon={<MultiColorPlusIcon />}
        />,
        ...TEMPLATE_PLACEHOLDERS.map((template, index) => {
            const Icon = template.icon;
            return (
                <BaseBoardCard
                    key={index}
                    title={template.name}
                    subtext={template.subtext}
                    onClick={() => handleTemplateClick(template.name)}
                    icon={<Icon size={36} className={`${template.iconColor} opacity-70`} />}
                    isDisabled={true}
                />
            );
        })
    ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground/90">Start a new board</h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="link"
                        onClick={() => handleTemplateClick()}
                        className="p-0 text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        Template gallery
                    </Button>
                    <TemplateGalleryActions />
                </div>
            </div>

            {isTemplatesVisible && (
                // KEY CHANGE: Using the same responsive grid layout classes as the Recent Boards section
                // to ensure direct column alignment.
                <div
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 pb-4 -mx-1"
                >
                    {allCards.map((card, index) => (
                        // Render cards directly inside the grid
                        <div key={index}>
                            {card}
                        </div>
                    ))}
                    {/* Filler divs to push the Template Gallery actions link to the end of the row */}
                    {[...Array(4 - (allCards.length % 4)).keys()].map(i => (
                        <div key={`filler-${i}`} className="hidden lg:block"></div>
                    ))}
                </div>
            )}

            <NewBoardModal open={isNewBoardModalOpen} onClose={() => setIsNewBoardModalOpen(false)} />
        </div>
    );
};