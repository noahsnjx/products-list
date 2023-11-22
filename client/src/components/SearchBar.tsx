import styled from "@emotion/styled";
import Input from "./Input";
import Label from "./Label";

const SearchBarRoot = styled.div({
  display: "flex",
  margin: "0 32px 24px 32px",
  justifyContent: "center"
});

const Checkbox = styled.div({
  display: "flex",
  flexDirection: "column-reverse"
});

interface ISearchBar {
  query: string;
  onlyStock: boolean;
  onSearch: (event) => void;
  onChangeView: () => void;
}

const SearchBar: React.FC<ISearchBar> = ({ onChangeView, onSearch, query, onlyStock }) => {
  return (
    <SearchBarRoot>
      <Input value={query} placeholder="Search..." onChange={onSearch} style={{ flex: "1" }} />
      <Checkbox>
        <Input type="checkbox" checked={onlyStock} onChange={onChangeView} />
        <Label>Only show products in stock</Label>
      </Checkbox>
    </SearchBarRoot>
  );
};

export default SearchBar;
