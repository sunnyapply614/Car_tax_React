import { ConfigProvider, Table } from "antd"
import styled from 'styled-components';

const StyledTable = styled(Table)`
    .ant-table-thead .ant-table-cell {
        background-color: #364153;
        color : white;
        text-align : center;
    }
    .bSxUZv .ant-table-thead .ant-table-cell {
        color : red;
    }
    .hGdCCo .ant-table-thead .ant-table-cell {
        color : red;
    }
    .ant-table-thead > tr > th { position: static !important }
`;
const MyBlackTable = (props) => {
    return (
        <div>
            <StyledTable {...props} />
        </div>
    )
}
export { MyBlackTable }
