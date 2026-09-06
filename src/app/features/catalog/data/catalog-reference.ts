import { CategoryNode } from '@/features/catalog/model/category';
import { ColorOption, FacetOption } from '@/features/catalog/model/facet';

// TEMPORARY. The `catalog` reference module in re_backend is still empty, so this fixture
// stands in for its response and is shaped like one. Delete it — not adapt it — once the
// endpoint exists; the API is the source of truth for both ids and labels.
//
// Two things the real endpoint does that the fixture does not: size charts and material
// lists are scoped to a category node (shoes use EU sizes, home has no size at all), and
// labels come back localised. Here both are flat and English.
export interface CatalogReference {
  readonly categories: readonly CategoryNode[];
  readonly sizes: readonly FacetOption[];
  readonly brands: readonly FacetOption[];
  readonly colors: readonly ColorOption[];
  readonly materials: readonly FacetOption[];
  readonly cities: readonly FacetOption[];
}

const CATEGORIES: readonly CategoryNode[] = [
  {
    id: 'women',
    label: 'Women',
    children: [
      {
        id: 'women-clothing',
        label: 'Clothing',
        children: [
          { id: 'women-tops', label: 'Tops', children: [] },
          { id: 'women-dresses', label: 'Dresses', children: [] },
          { id: 'women-jeans', label: 'Jeans', children: [] },
          { id: 'women-outerwear', label: 'Coats and jackets', children: [] },
        ],
      },
      {
        id: 'women-shoes',
        label: 'Shoes',
        children: [
          { id: 'women-sneakers', label: 'Sneakers', children: [] },
          { id: 'women-boots', label: 'Boots', children: [] },
        ],
      },
      { id: 'women-bags', label: 'Bags', children: [] },
      { id: 'women-accessories', label: 'Accessories', children: [] },
    ],
  },
  {
    id: 'men',
    label: 'Men',
    children: [
      {
        id: 'men-clothing',
        label: 'Clothing',
        children: [
          { id: 'men-shirts', label: 'Shirts', children: [] },
          { id: 'men-jeans', label: 'Jeans', children: [] },
          { id: 'men-outerwear', label: 'Coats and jackets', children: [] },
        ],
      },
      {
        id: 'men-shoes',
        label: 'Shoes',
        children: [
          { id: 'men-sneakers', label: 'Sneakers', children: [] },
          { id: 'men-boots', label: 'Boots', children: [] },
        ],
      },
      { id: 'men-accessories', label: 'Accessories', children: [] },
    ],
  },
  {
    id: 'kids',
    label: 'Kids',
    children: [
      { id: 'kids-clothing', label: 'Clothing', children: [] },
      { id: 'kids-shoes', label: 'Shoes', children: [] },
      { id: 'kids-toys', label: 'Toys', children: [] },
    ],
  },
  {
    id: 'home',
    label: 'Home',
    children: [
      { id: 'home-textiles', label: 'Textiles', children: [] },
      { id: 'home-decor', label: 'Decor', children: [] },
      { id: 'home-kitchen', label: 'Kitchen', children: [] },
    ],
  },
  {
    id: 'electronics',
    label: 'Electronics',
    children: [
      { id: 'electronics-phones', label: 'Phones', children: [] },
      { id: 'electronics-audio', label: 'Audio', children: [] },
      { id: 'electronics-computers', label: 'Computers', children: [] },
    ],
  },
  { id: 'books', label: 'Books', children: [] },
  {
    id: 'sports',
    label: 'Sports',
    children: [
      { id: 'sports-equipment', label: 'Equipment', children: [] },
      { id: 'sports-clothing', label: 'Sportswear', children: [] },
    ],
  },
];

const SIZES: readonly FacetOption[] = [
  { id: 'xs', label: 'XS' },
  { id: 's', label: 'S' },
  { id: 'm', label: 'M' },
  { id: 'l', label: 'L' },
  { id: 'xl', label: 'XL' },
  { id: 'xxl', label: 'XXL' },
];

const BRANDS: readonly FacetOption[] = [
  { id: 'zara', label: 'Zara' },
  { id: 'hm', label: 'H&M' },
  { id: 'nike', label: 'Nike' },
  { id: 'adidas', label: 'Adidas' },
  { id: 'levis', label: "Levi's" },
  { id: 'uniqlo', label: 'Uniqlo' },
  { id: 'mango', label: 'Mango' },
  { id: 'cos', label: 'COS' },
];

const COLORS: readonly ColorOption[] = [
  { id: 'black', label: 'Black', hex: '#000000' },
  { id: 'white', label: 'White', hex: '#ffffff' },
  { id: 'grey', label: 'Grey', hex: '#9ca3af' },
  { id: 'beige', label: 'Beige', hex: '#e7d8c1' },
  { id: 'brown', label: 'Brown', hex: '#7c4a24' },
  { id: 'red', label: 'Red', hex: '#dc2626' },
  { id: 'pink', label: 'Pink', hex: '#f472b6' },
  { id: 'blue', label: 'Blue', hex: '#2563eb' },
  { id: 'green', label: 'Green', hex: '#16a34a' },
  { id: 'yellow', label: 'Yellow', hex: '#facc15' },
];

const MATERIALS: readonly FacetOption[] = [
  { id: 'cotton', label: 'Cotton' },
  { id: 'wool', label: 'Wool' },
  { id: 'linen', label: 'Linen' },
  { id: 'leather', label: 'Leather' },
  { id: 'denim', label: 'Denim' },
  { id: 'silk', label: 'Silk' },
  { id: 'polyester', label: 'Polyester' },
];

const CITIES: readonly FacetOption[] = [
  { id: 'belgrade', label: 'Belgrade' },
  { id: 'novi-sad', label: 'Novi Sad' },
  { id: 'nis', label: 'Niš' },
  { id: 'subotica', label: 'Subotica' },
];

export const CATALOG_REFERENCE: CatalogReference = {
  categories: CATEGORIES,
  sizes: SIZES,
  brands: BRANDS,
  colors: COLORS,
  materials: MATERIALS,
  cities: CITIES,
};
