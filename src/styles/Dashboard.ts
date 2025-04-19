import styled from "styled-components";

const DashboardContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.palette.background.default};
`;

export default DashboardContainer;
