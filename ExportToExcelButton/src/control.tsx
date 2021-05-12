import { ActionButton } from '@fluentui/react/lib/Button';
import { IIconProps } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import * as React from 'react';
import * as XLSX from 'xlsx';

export interface IControlProps {
    jsonData?:string
    filename?:string
    text?:string
}

export function initializeControl() {
    initializeIcons()
}

export function exportToExcel( data:string, fileName:string ) {

    console.log( data )
    const testss = JSON.parse(data);
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(testss);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    XLSX.writeFile(workbook,fileName);
}

const excel: IIconProps = { iconName: 'excelDocument' };

export const ExportToExcelControl: React.FunctionComponent<IControlProps> = props => {
  const { jsonData, filename, text } = props;

  const isValid = () => jsonData && filename

  const exportToExcelHandler = React.useCallback(() => {

        if( jsonData && filename ) {

            try {
              exportToExcel( jsonData, filename )
            }
            catch( e ) {
                console.error( e )
            }
        }

  },[])

  return (
    <ActionButton iconProps={excel} allowDisabledFocus disabled={!isValid()} onClick={exportToExcelHandler} text={text} >
      Export to Excel
    </ActionButton>
  );
};
