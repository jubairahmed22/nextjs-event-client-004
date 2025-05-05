"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface Category {
  _id: string;
  title: string;
  hasSubcategories?: boolean;
}

export interface SubCategory {
  _id: string;
  title: string;
  category: string;
}

export interface Filters {
  title: string;
  productId: string;
  category: string;
  subCategory: string;
  SelectedType: string;
  productCode: string;
  promotionFilter: string;
  minPrice: string;
  maxPrice: string;
}

interface FilterContextType {
  filters: Filters;
  categories: Category[];
  subCategories: Record<string, SubCategory[]>;
  loading: boolean;
  isSidebarOpen: boolean;
  currentPage: number;
  totalPages: number;

  setIsSidebarOpen: (isOpen: boolean) => void;
  handleFilterChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handlePriceChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePromotionToggle: () => void;
  handleCategoryChange: (categoryId: string) => void;
  handleSubCategoryChange: (subCategoryId: string) => void;
  handlePageChange: (page: number) => void;
  clearFilters: () => void;
  fetchSubCategories: (categoryId: string) => Promise<void>;
  applyFilters: (newFilters: Partial<Filters>, pageReset?: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<Filters>({
    title: "",
    productId: "",
    category: "",
    subCategory: "",
    SelectedType: "",
    productCode: "",
    promotionFilter: "",
    minPrice: "",
    maxPrice: "",
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<
    Record<string, SubCategory[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Initialize from URL
  useEffect(() => {
    const qParam = searchParams.get("q");
    const categoryParam = searchParams.get("category");
    const subCategoryParam = searchParams.get("subCategory");
    const minPriceParam = searchParams.get("minPrice");
    const maxPriceParam = searchParams.get("maxPrice");
    const promotionParam = searchParams.get("promotion");
    const pageParam = searchParams.get("page");

    const newFilters = { ...filters };
    if (qParam) newFilters.title = qParam;
    if (categoryParam) newFilters.category = categoryParam;
    if (subCategoryParam) newFilters.subCategory = subCategoryParam;
    if (minPriceParam) newFilters.minPrice = minPriceParam;
    if (maxPriceParam) newFilters.maxPrice = maxPriceParam;
    if (promotionParam) {
      newFilters.promotionFilter = promotionParam === '"true"' ? "true" : "";
    }

    setFilters(newFilters);
    setCurrentPage(pageParam ? parseInt(pageParam, 10) : 1);
  }, [searchParams]);

  // Fetch categories with pagination
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://server-gs.vercel.app/web/main-category?page=${currentPage}`
        );
        const data = await res.json();

        const formatted = (data.products || []).map((cat: Category) => ({
          ...cat,
          hasSubcategories: undefined,
        }));
        setCategories(formatted);
        setTotalPages(data.totalPages || 1);

        formatted.forEach((cat: Category) => fetchSubCategories(cat._id));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [currentPage]);

  const fetchSubCategories = async (categoryId: string) => {
    if (subCategories[categoryId]) return;
    try {
      const res = await fetch(
        `https://server-gs.vercel.app/admin/web/sub-category/${categoryId}`
      );
      const data = await res.json();
      if (data.subCategories?.length > 0) {
        setSubCategories((prev) => ({
          ...prev,
          [categoryId]: data.subCategories,
        }));
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === categoryId ? { ...cat, hasSubcategories: true } : cat
          )
        );
      } else {
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === categoryId ? { ...cat, hasSubcategories: false } : cat
          )
        );
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const applyFilters = (newFilters: Partial<Filters>, pageReset = true) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const pageToSet = pageReset ? 1 : currentPage;

    if (pathname !== "/all-products") {
      updateUrlParams(updatedFilters, pageToSet, "/all-products");
    } else {
      updateUrlParams(updatedFilters, pageToSet);
    }
  };

  const updateUrlParams = (
    updatedFilters: Filters,
    page: number,
    newPath?: string
  ) => {
    const urlParams = new URLSearchParams();

    if (updatedFilters.title) urlParams.set("q", updatedFilters.title);
    if (updatedFilters.category)
      urlParams.set("category", updatedFilters.category);
    if (updatedFilters.subCategory)
      urlParams.set("subCategory", updatedFilters.subCategory);
    if (updatedFilters.minPrice)
      urlParams.set("minPrice", updatedFilters.minPrice);
    if (updatedFilters.maxPrice)
      urlParams.set("maxPrice", updatedFilters.maxPrice);
    if (updatedFilters.promotionFilter === "true") {
      urlParams.set("promotion", '"true"');
    }
    urlParams.set("page", page.toString());

    const url = `${newPath || pathname}?${urlParams.toString()}`;
    router.push(url, undefined, { shallow: true });
    setCurrentPage(page);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    applyFilters({ [name]: value });
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    applyFilters({ [name]: value });
  };

  const handlePromotionToggle = () => {
    applyFilters({
      promotionFilter: filters.promotionFilter === "true" ? "" : "true",
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    applyFilters(
      {
        category: categoryId === filters.category ? "" : categoryId,
        subCategory: "",
        promotionFilter: "", // Reset promotion filter when category changes
      },
      false // KEEP current page
    );
  };
  
  const handleSubCategoryChange = (subCategoryId: string) => {
    // Find which category this subcategory belongs to
    const parentCategory = Object.entries(subCategories).find(([catId, subs]) => 
      subs.some(sub => sub._id === subCategoryId)
    )?.[0] || "";
  
    applyFilters(
      {
        category: parentCategory, // Only include the correct parent category
        subCategory: subCategoryId === filters.subCategory ? "" : subCategoryId,
        promotionFilter: "", // Reset promotion filter when subcategory changes
      },
      false // KEEP current page
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      updateUrlParams(filters, page);
    }
  };

  const clearFilters = () => {
    const resetFilters = {
      title: "",
      productId: "",
      category: "",
      subCategory: "",
      SelectedType: "",
      productCode: "",
      promotionFilter: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(resetFilters);
    setCurrentPage(1);
    router.push("/all-products?page=1", undefined, { shallow: true });
  };

  return (
    <FilterContext.Provider
      value={{
        filters,
        categories,
        subCategories,
        loading,
        isSidebarOpen,
        currentPage,
        totalPages,
        setIsSidebarOpen,
        handleFilterChange,
        handlePriceChange,
        handlePromotionToggle,
        handleCategoryChange,
        handleSubCategoryChange,
        handlePageChange,
        clearFilters,
        fetchSubCategories,
        applyFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};
