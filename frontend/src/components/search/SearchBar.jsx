import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import searchService from '../../api/searchService';

const SearchBar = () => {
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchText) => {
    if (!searchText || searchText.length < 2) {
      setOptions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await searchService.autocomplete(searchText);
      const suggestions = response.suggestions || response.products || [];

      const formattedOptions = suggestions.map((item) => ({
        value: item.name || item.title,
        label: item.name || item.title,
        id: item.id,
      }));

      setOptions(formattedOptions);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (selectedValue) => {
    setValue(selectedValue);
    navigate(`/products?search=${encodeURIComponent(selectedValue)}`);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex" style={{ minWidth: '200px', maxWidth: '400px' }}>
      <AutoComplete
        value={value}
        options={options}
        onSearch={handleSearch}
        onSelect={handleSelect}
        onChange={setValue}
        placeholder="Search products..."
        style={{ width: '100%' }}
        className="me-2"
      />
      <button type="submit" className="btn btn-outline-light">
        <SearchOutlined />
      </button>
    </form>
  );
};

export default SearchBar;
