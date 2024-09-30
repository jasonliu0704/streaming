interface SelectDataType {
  uploadImagePath: string;
}
export const SelectData: SelectDataType = {
  uploadImagePath: "",
};

export function updateSelectData(data: string) {
  SelectData.uploadImagePath = data;
}
