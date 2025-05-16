"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
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

  // Get current URL params as an object
  const currentParams = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  // Initialize state from URL params
  const [filters, setFilters] = useState<Filters>(() => ({
    title: currentParams.q || "",
    productId: "",
    category: currentParams.category || "",
    subCategory: currentParams.subCategory || "",
    SelectedType: "",
    productCode: "",
    promotionFilter: currentParams.promotion === '"true"' ? "true" : "",
    minPrice: currentParams.minPrice || "",
    maxPrice: currentParams.maxPrice || "",
  }));

  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<
    Record<string, SubCategory[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(
    Number(currentParams.page) || 1
  );
  const [totalPages, setTotalPages] = useState(1);

  // Update filters when URL params change
  useEffect(() => {
    setFilters({
      title: currentParams.q || "",
      productId: "",
      category: currentParams.category || "",
      subCategory: currentParams.subCategory || "",
      SelectedType: "",
      productCode: "",
      promotionFilter: currentParams.promotion === '"true"' ? "true" : "",
      minPrice: currentParams.minPrice || "",
      maxPrice: currentParams.maxPrice || "",
    });
    setCurrentPage(Number(currentParams.page) || 1);
  }, [currentParams]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://server-gs.vercel.app/web/main-category?page=${currentPage}`
      );
      const data = await res.json();

      const formatted = (data.products || []).map((cat: Category) => ({
        ...cat,
        hasSubcategories: subCategories[cat._id] ? true : undefined,
      }));

      setCategories(formatted);
      setTotalPages(data.totalPages || 1);

      // If we have a category filter, ensure its subcategories are loaded
      if (filters.category && !subCategories[filters.category]) {
        await fetchSubCategories(filters.category);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters.category, subCategories]);

  // Fetch subcategories
  const fetchSubCategories = useCallback(async (categoryId: string) => {
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

        // Update the hasSubcategories flag
        setCategories(prev =>
          prev.map(cat =>
            cat._id === categoryId ? { ...cat, hasSubcategories: true } : cat
          )
        );
      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  }, []);

  // Fetch categories when page changes or filters change
  useEffect(() => {
    fetchCategories();
  }, [currentPage, fetchCategories]);

  // Update URL when filters change
  const applyFilters = useCallback(
    (newFilters: Partial<Filters>, pageReset = true) => {
      setFilters((prev) => {
        const updatedFilters = { ...prev, ...newFilters };
        const pageToSet = pageReset ? 1 : currentPage;

        const params = new URLSearchParams();

        if (updatedFilters.title) params.set("q", updatedFilters.title);
        if (updatedFilters.category) params.set("category", updatedFilters.category);
        if (updatedFilters.subCategory) params.set("subCategory", updatedFilters.subCategory);
        if (updatedFilters.minPrice) params.set("minPrice", updatedFilters.minPrice);
        if (updatedFilters.maxPrice) params.set("maxPrice", updatedFilters.maxPrice);
        if (updatedFilters.promotionFilter === "true") {
          params.set("promotion", '"true"');
        }
        params.set("page", pageToSet.toString());

        // Special handling for subcategory to category navigation
        if (newFilters.category && !newFilters.subCategory && prev.subCategory) {
          params.delete("subCategory");
        }

        const url = `${pathname}?${params.toString()}`;
        router.replace(url);

        return updatedFilters;
      });

      if (pageReset) {
        setCurrentPage(1);
      }
    },
    [currentPage, pathname, router]
  );

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
      category: "",
      subCategory: "",
    });
  };

  const handleCategoryChange = (categoryId: string) => {
    // When changing category, clear subcategory and promotion
    applyFilters(
      {
        category: categoryId === filters.category ? "" : categoryId,
        subCategory: "",
        promotionFilter: "",
      },
      true
    );

    // Fetch subcategories if needed
    if (categoryId && !subCategories[categoryId]) {
      fetchSubCategories(categoryId);
    }
  };

  const handleSubCategoryChange = (subCategoryId: string) => {
    // When selecting subcategory, keep the parent category in URL
    const categoryForSub = categories.find(cat => 
      subCategories[cat._id]?.some(sub => sub._id === subCategoryId)
    )?._id || "";

    applyFilters(
      {
        subCategory: subCategoryId === filters.subCategory ? "" : subCategoryId,
        category: categoryForSub,
        promotionFilter: "",
      },
      true
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const clearFilters = () => {
    applyFilters({
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