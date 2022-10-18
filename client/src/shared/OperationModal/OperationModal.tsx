import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { Operation, OperationType, useOperationService } from "@services/OperationService";
import { useFormik } from "formik";
import { FC } from "react";
import * as Yup from "yup";

export type OperationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (operation: Omit<Operation, "userId">) => Promise<any>;
  selectedYear?: number;
};

const useOperationForm = ({ onSubmit }: Pick<OperationModalProps, "onSubmit">) => {
  const operationFormValidationSchema = Yup.object().shape({
    assetCode: Yup.string().required("Por favor, informe o código do ativo"),
    quantity: Yup.number()
      .min(1, "A operação deve possuir pelo menos 1 ativo")
      .required("Por favor, informe a quantidade de ativos da operação"),
    valuePerAsset: Yup.number()
      .min(0.01, "O valor da operação sobre o ativo deve ser de pelo menos 0.01")
      .required("Por favor, insira o valor por ação da sua operação."),
    date: Yup.date().required("Por favor, informe a data da operação"),
    type: Yup.mixed()
      .oneOf(
        [OperationType.Buying, OperationType.Selling],
        "Por favor, selecione o tipo Compra ou Venda."
      )
      .required("Por favor, informe o tipo da operação."),
  });

  const operationForm = useFormik({
    initialValues: {
      assetCode: "",
      quantity: 0,
      valuePerAsset: 0,
      date: new Date(),
      type: OperationType.Buying,
    },
    validationSchema: operationFormValidationSchema,
    onSubmit,
  });

  const onTypeChange = ($event: React.ChangeEvent<any>) => {
    operationForm.setFieldValue("type", +$event.target.value);
    operationForm.setFieldTouched("type", true);
  };

  return { operationForm, onTypeChange };
};

const useDateBoundaries = ({ selectedYear }: Pick<OperationModalProps, "selectedYear">) => {
  const dateBoundaries: { min?: string; max?: string } = {};

  if (selectedYear) {
    dateBoundaries.min = `${selectedYear}-01-01`;
    dateBoundaries.max = `${selectedYear}-12-31`;
  }

  return { dateBoundaries };
};

export const OperationModal = ({
  isOpen,
  onClose,
  onSubmit,
  selectedYear,
}: OperationModalProps) => {
  const { operationForm, onTypeChange } = useOperationForm({ onSubmit });
  const { dateBoundaries } = useDateBoundaries({ selectedYear });

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay></ModalOverlay>

      <ModalContent>
        <ModalHeader>Operação</ModalHeader>
        <ModalCloseButton></ModalCloseButton>
        <ModalBody>
          <form onSubmit={operationForm.handleSubmit} className="flex flex-col gap-4 py-4">
            <FormControl
              isInvalid={!!operationForm.errors.assetCode && operationForm.touched.assetCode}
            >
              <FormLabel htmlFor="assetCode">Código do ativo</FormLabel>
              <Input
                name="assetCode"
                type="text"
                onChange={operationForm.handleChange}
                value={operationForm.values.assetCode}
              />
              <FormErrorMessage>{operationForm.errors.assetCode}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={!!operationForm.errors.quantity && operationForm.touched.quantity}
            >
              <FormLabel htmlFor="quantity">Quantidade</FormLabel>
              <Input
                name="quantity"
                type="number"
                onChange={operationForm.handleChange}
                value={operationForm.values.quantity}
              />
              <FormErrorMessage>{operationForm.errors.quantity}</FormErrorMessage>
            </FormControl>
            <FormControl
              isInvalid={
                !!operationForm.errors.valuePerAsset && operationForm.touched.valuePerAsset
              }
            >
              <FormLabel htmlFor="valuePerAsset">Valor</FormLabel>
              <Input
                name="valuePerAsset"
                type="number"
                onChange={operationForm.handleChange}
                value={operationForm.values.valuePerAsset}
              />
              <FormErrorMessage>{operationForm.errors.valuePerAsset}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!operationForm.errors.date && !!operationForm.touched.date}>
              <FormLabel htmlFor="date">Data</FormLabel>
              <Input
                name="date"
                type="date"
                placeholder="dd/mm/AAAA"
                onChange={operationForm.handleChange}
                value={operationForm.values.date.toLocaleString()}
                {...dateBoundaries}
              />
              <FormErrorMessage>{JSON.stringify(operationForm.errors.date)}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!operationForm.errors.type && operationForm.touched.type}>
              <FormLabel htmlFor="type">Tipo da operação</FormLabel>
              <Select name="type" value={operationForm.values.type} onChange={onTypeChange}>
                <option value={OperationType.Buying}>Compra</option>
                <option value={OperationType.Selling}>Venda</option>
              </Select>
              <FormErrorMessage>{operationForm.errors.type}</FormErrorMessage>
            </FormControl>

            <Button type="submit" className="w-full mt-3" size="lg">
              Salvar
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
