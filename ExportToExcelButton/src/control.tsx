import { ActionButton } from '@fluentui/react/lib/Button';
import { IIconProps } from '@fluentui/react/lib/Icon';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import * as React from 'react';
import * as XLSX from 'xlsx';

export interface IControlProps {
    printable?:string
    filename?:string
    text?:string
}

export function initializeControl() {
    initializeIcons()
}

const excel: IIconProps = { iconName: 'excelDocument' };


export const ExportToExcelControl: React.FunctionComponent<IControlProps> = props => {
  const { printable, filename, text } = props;

  const isValid = () => printable && filename

  const exportToExcel = React.useCallback(() => {

        if( printable && filename ) {

            try {
                console.log( printable )
                const testss = JSON.parse(printable);
                const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(testss);
                const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
                XLSX.writeFile(workbook,filename);

            }
            catch( e ) {
                console.error( e )
            }
        }

  },[])

  return (
    <ActionButton iconProps={excel} allowDisabledFocus disabled={!isValid()} onClick={exportToExcel} text={text} >
      Export to Excel
    </ActionButton>
  );
};
