import { useState } from 'react';
import { 
    Modal, 
    ModalOverlay, 
    ModalContent, 
    ModalHeader, 
    ModalCloseButton, 
    ModalBody, 
    ModalFooter, 
    FormControl, 
    FormLabel, 
    Textarea, 
    Button }
     from "@chakra-ui/react";
import { editReport } from '../../services/client';

interface Grade {
    id: number;
    problem: Problem;
    grade: number;
    report: string;
    participant: Participant;
    examId: number;
}

interface Problem {
    id: number;
    title: string;
    description: string;
}
interface Participant {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  }

interface Props {
    grade: Grade;
    onClose: () => void;
}


function EditReportModal({ grade, onClose }: Props) {
    console.log(grade);
    const [report, setReport] = useState(grade.report);


    const handleUpdateReport = async () => {
        try {
            await editReport(grade.id, report);


            onClose(); 
            setReport(grade.report);

            
        } catch (error) {
            console.error("Failed to update report:", error);
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Report</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Report</FormLabel>
                        <Textarea
                            value={report}
                            onChange={(e) => setReport(e.target.value)}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleUpdateReport}>Submit</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default EditReportModal;
