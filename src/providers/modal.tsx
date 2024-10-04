"use client"
import { createContext, ReactNode, useState} from "react"
import {TicketsProps} from "@/utils/ticket.type"
import { CustomerProps } from "@/utils/customer.type"
import { Modal } from "@/components/Modal";

interface ModalContextData{
    visible: boolean;
    handleModalVisible: () => void;
    ticket: TicketInfo | undefined;
    setDetailTicket: (detail: TicketInfo) => void;
}

interface TicketInfo {
    ticket: TicketsProps;
    customer: CustomerProps | null;
}

export const ModalContext = createContext({} as ModalContextData)

export const ModalProvider = ({children}: {children: ReactNode}) => {
    const [visible, setVisible] = useState(false);
    const [ticket, setTicket] = useState<TicketInfo>()

    function handleModalVisible(){
        setVisible(!visible);
    }

    function setDetailTicket(detail: TicketInfo){
        setTicket(detail);
        console.log(detail)
    }

    return(
        <ModalContext.Provider value={{visible, handleModalVisible, ticket, setDetailTicket}}>
            {visible && <Modal />}
            {children}
        </ModalContext.Provider>
    )
}