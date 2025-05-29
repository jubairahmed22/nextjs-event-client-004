"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
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

  // Initialize filters from URL params immediately
  const initialFilters = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      title: params.get("q") || "",
      productId: "",
      category: params.get("category") || "",
      subCategory: params.get("subCategory") || "",
      SelectedType: "",
      productCode: "",
      promotionFilter: params.get("promotion") === "true" ? "true" : "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<
    Record<string, SubCategory[]>
  >({});
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const [totalPages, setTotalPages] = useState(1);

  // Sync state with URL params when they change
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const newPage = parseInt(params.get("page") || "1", 10);
    
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }

    const newFilters = {
      title: params.get("q") || "",
      category: params.get("category") || "",
      subCategory: params.get("subCategory") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      promotionFilter: params.get("promotion") === "true" ? "true" : "",
      // Reset these to empty string as they're not in URL
      productId: "",
      SelectedType: "",
      productCode: "",
    };

    setFilters(prev => {
      // Only update if something actually changed
      if (JSON.stringify(prev) !== JSON.stringify(newFilters)) {
        return newFilters;
      }
      return prev;
    });
  }, [searchParams]);

  // Fetch categories with pagination
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:8000/web/main-category?page=${currentPage}`
      );
      const data = await res.json();

      const formatted = (data.products || []).map((cat: Category) => ({
        ...cat,
        hasSubcategories: subCategories[cat._id] ? true : undefined,
      }));
      
      setCategories(formatted);
      setTotalPages(data.totalPages || 1);

      // Fetch subcategories for categories that don't have them yet
      formatted.forEach((cat: Category) => {
        if (!subCategories[cat._id]) {
          fetchSubCategories(cat._id);
        }
      });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/admin/web/sub-category/${categoryId}`
      );
      const data = await res.json();
      
      if (data.subCategories?.length > 0) {
        setSubCategories((prev) => ({
          ...prev,
          [categoryId]: data.subCategories,
        }));
        
        // Update the hasSubcategories flag for this category
        setCategories(prev => 
          prev.map(cat => 
            cat._id === categoryId 
              ? { ...cat, hasSubcategories: true } 
              : cat
          )
        );
      } else {
        setCategories(prev =>
          prev.map(cat =>
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
    updateUrlParams(updatedFilters, pageToSet);
  };

  const updateUrlParams = (updatedFilters: Filters, page: number) => {
    const urlParams = new URLSearchParams();

    if (updatedFilters.title) urlParams.set("q", updatedFilters.title);
    if (updatedFilters.category) urlParams.set("category", updatedFilters.category);
    if (updatedFilters.subCategory) urlParams.set("subCategory", updatedFilters.subCategory);
    if (updatedFilters.minPrice) urlParams.set("minPrice", updatedFilters.minPrice);
    if (updatedFilters.maxPrice) urlParams.set("maxPrice", updatedFilters.maxPrice);
    if (updatedFilters.promotionFilter === "true") {
      urlParams.set("promotion", "true");
    }
    urlParams.set("page", page.toString());

    // Only push if the URL would actually change
    const newUrl = `${pathname}?${urlParams.toString()}`;
    if (`${pathname}?${searchParams.toString()}` !== newUrl) {
      router.push(newUrl, { scroll: false });
    }
    
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
      subCategory: "",
      category:""
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    applyFilters(
      {
        category: categoryId === filters.category ? "" : categoryId,
        subCategory: "",
        promotionFilter: "",
      },
      false
    );
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    const parentCategory =
      Object.entries(subCategories).find(([catId, subs]) =>
        subs.some((sub) => sub._id === subCategoryId)
      )?.[0] || "";

    applyFilters(
      {
        category: parentCategory,
        subCategory: subCategoryId === filters.subCategory ? "" : subCategoryId,
        promotionFilter: "",
      },
      false
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
    router.push(`${pathname}?page=1`, { scroll: false });
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