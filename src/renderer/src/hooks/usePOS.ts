import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import { useSettingsStore } from '../store/settingsStore'
import { BankAccount, Customer, InventoryItem, Product } from '../types/pos'
import { getExpiryStatus, shouldAlertOnSale } from '../utils/expiryHelpers'

type SaleItem = {
  barcode: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  discountPercent: number
  taxRate: number
  subtotal: number
}

type CompletedSaleDetails = {
  invoiceNumber: string
  customerName?: string
  date: string
  items: SaleItem[]
  subtotal: number
  discountAmount: number
  taxAmount: number
  totalAmount: number
  paidAmount: number
  changeAmount: number
  paymentMethod: string
  pointsRedeemed?: number
}

type POSHookReturn = {
  // State
  searchTerm: string
  products: Product[]
  inventory: InventoryItem[]
  accounts: BankAccount[]
  customerSearch: string
  customers: Customer[]
  selectedCustomer: Customer | null
  showCustomerDropdown: boolean
  loading: boolean
  cashReceived: string
  selectedAccount: string
  discountPercent: string
  pointsToRedeem: number
  searchInputRef: React.RefObject<HTMLInputElement | null>
  cart: {
    items: Array<{
      id: string
      productId: string
      name: string
      barcode: string
      price: number
      quantity: number
      discount: number
      taxRate: number
      batchNumber?: string
      expiryDate?: string
    }>
    getSubtotal: () => number
    updateQuantity: (id: string, quantity: number) => void
    removeItem: (id: string) => void
    clearCart: () => void
  }
  taxRate: number
  showSaleCompleteDialog: boolean
  completedSaleDetails: CompletedSaleDetails | null
  storeName: string
  storeAddress: string
  storePhone: string

  // Computed values
  currencySymbol: string
  total: number
  change: number
  maxRedeemablePoints: number
  pointValue: number

  // Handlers
  setSearchTerm: (v: string) => void
  setCustomerSearch: (v: string) => void
  setCashReceived: (v: string) => void
  setDiscountPercent: (v: string) => void
  setPointsToRedeem: (v: number) => void
  setShowCustomerDropdown: (v: boolean) => void
  setShowSaleCompleteDialog: (v: boolean) => void
  addToCart: (product: Product) => void
  selectCustomer: (customer: Customer) => void
  clearCustomer: () => void
  handleCheckout: () => Promise<void>
  handleReset: () => void
  handleAccountSelect: (accountId: string, accountType: string) => void
}

export function usePOS(): POSHookReturn {
  // Stores (must be called first, before any other hooks)
  const cart = useCartStore()
  const user = useAuthStore((state) => state.user)
  const currency = useSettingsStore((state) => state.currency)
  const taxRate = useSettingsStore((state) => state.taxRate)
  const storeName = useSettingsStore((state) => state.storeName)
  const storeAddress = useSettingsStore((state) => state.storeAddress)
  const storePhone = useSettingsStore((state) => state.storePhone)

  // New comprehensive settings
  const discountMaxCashier = useSettingsStore((state) => state.discountMaxPercentageCashier)
  const discountMaxManager = useSettingsStore((state) => state.discountMaxPercentageManager)
  const discountMaxAdmin = useSettingsStore((state) => state.discountMaxPercentageAdmin)
  const loyaltyPointsEnabled = useSettingsStore((state) => state.loyaltyPointsEnabled)
  const loyaltyPointsRedemptionValue = useSettingsStore(
    (state) => state.loyaltyPointsRedemptionValue
  )
  const posAlertLowStock = useSettingsStore((state) => state.posAlertLowStock)

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [customerSearch, setCustomerSearch] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [barcodeBuffer, setBarcodeBuffer] = useState('')
  const [cashReceived, setCashReceived] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [discountPercent, setDiscountPercent] = useState('')
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [showSaleCompleteDialog, setShowSaleCompleteDialog] = useState(false)
  const [completedSaleDetails, setCompletedSaleDetails] = useState<CompletedSaleDetails | null>(
    null
  )

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null)
  const barcodeTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Currency Symbol
  const getCurrencySymbol = (): string => {
    switch (currency) {
      case 'USD':
        return '$'
      case 'EUR':
        return '€'
      case 'GBP':
        return '£'
      case 'BDT':
        return '৳'
      case 'INR':
        return '₹'
      default:
        return '$'
    }
  }

  // Load products
  const loadProducts = async (): Promise<void> => {
    try {
      setLoading(true)
      const allProducts = await window.api.products.getAll()
      const typedProducts = allProducts as unknown as Product[]
      setProducts(typedProducts)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  // Search products
  const searchProducts = async (): Promise<void> => {
    if (!searchTerm.trim()) {
      await loadProducts()
      return
    }

    try {
      const results = await window.api.products.getAll(searchTerm)
      const typedResults = results as unknown as Product[]
      setProducts(typedResults)
    } catch {
      toast.error('Search failed')
    }
  }

  // Load inventory
  const loadInventory = async (): Promise<void> => {
    try {
      const inv = await window.api.inventory.getAll()
      const typedInv = inv as unknown as InventoryItem[]
      setInventory(typedInv)
    } catch {
      toast.error('Failed to load inventory')
    }
  }

  // Load accounts
  const loadAccounts = async (): Promise<void> => {
    try {
      const allAccountsData = await window.api.bankAccounts.getAll()
      const allAccounts = allAccountsData as unknown as BankAccount[]
      setAccounts(allAccounts.filter((acc) => acc.isActive))
    } catch {
      toast.error('Failed to load accounts')
    }
  }

  // Add to cart
  const addToCart = useCallback(
    (product: Product): void => {
      const inventoryItem = inventory.find((inv) => inv.productId === product.id)
      if (inventoryItem && inventoryItem.quantity <= 0) {
        toast.error('Product out of stock')
        return
      }

      // Check expiry date
      if (inventoryItem?.expiryDate) {
        const expiryStatus = getExpiryStatus(inventoryItem.expiryDate)
        if (expiryStatus && shouldAlertOnSale(inventoryItem.expiryDate)) {
          if (expiryStatus.status === 'expired') {
            toast.error(`${product.name} has expired! Cannot sell.`)
            return
          }
          toast(`${product.name} ${expiryStatus.label}`, {
            icon: '⚠️',
            duration: 4000,
            style: {
              background: '#fff3cd',
              color: '#856404'
            }
          })
        }
      }

      // Check low stock
      if (inventoryItem && posAlertLowStock && inventoryItem.quantity <= product.reorderLevel) {
        toast(`Low stock alert: ${product.name} (${inventoryItem.quantity} remaining)`, {
          icon: '⚠️',
          duration: 3000,
          style: {
            background: '#fff3cd',
            color: '#856404'
          }
        })
      }

      cart.addItem({
        productId: product.id,
        barcode: product.barcode || product.sku,
        name: product.name,
        price: product.sellingPrice,
        quantity: 1,
        discount: product.discountPercent || 0,
        taxRate: product.taxRate || 0
      })
      toast.success(`${product.name} added to cart`)
      searchInputRef.current?.focus()
    },
    [cart, inventory, posAlertLowStock]
  )

  // Handle barcode search
  const handleBarcodeSearch = useCallback(
    async (barcode: string): Promise<void> => {
      if (!barcode.trim()) return

      try {
        const productData = await window.api.products.getByBarcode(barcode)
        if (productData) {
          const product = productData as unknown as Product
          addToCart(product)
        } else {
          toast.error('Product not found')
        }
      } catch {
        toast.error('Barcode search error')
      }
    },
    [addToCart]
  )

  // Search customers
  const searchCustomers = async (): Promise<void> => {
    try {
      const results = await window.api.customers.getAll(customerSearch)
      const typedResults = results as unknown as Customer[]
      setCustomers(typedResults)
    } catch {
      toast.error('Failed to search customers')
    }
  }

  // Select customer
  const selectCustomer = (customer: Customer): void => {
    cart.setCustomer(customer.id)
    setSelectedCustomer(customer)
    setCustomerSearch(customer.name)
    setShowCustomerDropdown(false)
    toast.success(`Customer ${customer.name} selected`)
  }

  // Clear customer
  const clearCustomer = (): void => {
    cart.setCustomer(undefined)
    setSelectedCustomer(null)
    setCustomerSearch('')
    setCustomers([])
  }

  // Get max discount allowed for current user
  const getMaxDiscountAllowed = (): number => {
    if (!user) return 0
    switch (user.role) {
      case 'cashier':
        return discountMaxCashier
      case 'manager':
        return discountMaxManager
      case 'admin':
      case 'super_admin':
        return discountMaxAdmin
      default:
        return 0
    }
  }

  // Calculate total
  const calculateTotal = (): number => {
    const subtotal = cart.getSubtotal()
    let discountPercentValue = parseFloat(discountPercent) || 0

    // Enforce max discount based on user role
    const maxDiscount = getMaxDiscountAllowed()
    if (discountPercentValue > maxDiscount) {
      discountPercentValue = maxDiscount
      toast.error(`Discount limited to ${maxDiscount}% for your role (${user?.role || 'unknown'})`)
      setDiscountPercent(maxDiscount.toString())
    }

    const percentDiscountAmount = (subtotal * discountPercentValue) / 100
    const pointsDiscountAmount = loyaltyPointsEnabled
      ? pointsToRedeem * loyaltyPointsRedemptionValue
      : 0
    const totalDiscountAmount = percentDiscountAmount + pointsDiscountAmount
    const taxableAmount = subtotal - totalDiscountAmount
    const taxAmount = (taxableAmount * taxRate) / 100
    return subtotal - totalDiscountAmount + taxAmount
  }

  // Get max redeemable points
  const getMaxRedeemablePoints = (): number => {
    if (!selectedCustomer || !loyaltyPointsEnabled) return 0
    const availablePoints = selectedCustomer.loyaltyPoints || 0
    const subtotal = cart.getSubtotal()
    const maxBySubtotal = Math.floor(subtotal / loyaltyPointsRedemptionValue)
    return Math.min(availablePoints, maxBySubtotal)
  }

  // Calculate change
  const calculateChange = (): number => {
    const cash = parseFloat(cashReceived) || 0
    const total = calculateTotal()
    return Math.max(0, cash - total)
  }

  // Handle checkout
  const handleCheckout = async (): Promise<void> => {
    if (cart.items.length === 0) {
      toast.error('Cart is empty')
      return
    }

    const cash = parseFloat(cashReceived) || 0
    const finalTotal = calculateTotal()

    if (cash < finalTotal) {
      toast.error('Insufficient payment amount')
      return
    }

    if (!user) return

    try {
      const invoiceNumber = `INV-${Date.now()}`
      const discountPercentValue = parseFloat(discountPercent) || 0
      const subtotal = cart.getSubtotal()
      const percentDiscountAmount = (subtotal * discountPercentValue) / 100
      const pointsDiscountAmount = loyaltyPointsEnabled
        ? pointsToRedeem * loyaltyPointsRedemptionValue
        : 0
      const totalDiscountAmount = percentDiscountAmount + pointsDiscountAmount
      const taxableAmount = subtotal - totalDiscountAmount
      const taxAmount = (taxableAmount * taxRate) / 100

      const sale = {
        invoiceNumber,
        userId: user.id,
        customerId: selectedCustomer?.id || null,
        accountId: selectedAccount || null,
        subtotal: subtotal,
        taxAmount: taxAmount,
        discountAmount: totalDiscountAmount,
        totalAmount: finalTotal,
        paidAmount: cash,
        changeAmount: cash - finalTotal,
        paymentMethod,
        status: 'completed',
        pointsRedeemed: pointsToRedeem
      }

      const items = cart.items.map((item) => ({
        barcode: item.barcode,
        productId: item.productId,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        discountPercent: item.discount,
        taxRate: item.taxRate,
        subtotal: item.price * item.quantity
      }))

      await window.api.sales.create(sale, items)

      // Prepare sale details for dialog
      const saleDetails = {
        invoiceNumber,
        customerName: selectedCustomer?.name,
        date: new Date().toISOString(),
        items: items,
        subtotal: subtotal,
        discountAmount: totalDiscountAmount,
        taxAmount: taxAmount,
        totalAmount: finalTotal,
        paidAmount: cash,
        changeAmount: cash - finalTotal,
        paymentMethod,
        pointsRedeemed: pointsToRedeem
      }

      setCompletedSaleDetails(saleDetails)
      setShowSaleCompleteDialog(true)
      toast.success(`Sale completed! Invoice: ${invoiceNumber}`)

      // Reset form but keep dialog open
      cart.clearCart()
      setSelectedCustomer(null)
      setCustomerSearch('')
      setCashReceived('')
      setDiscountPercent('')
      setPointsToRedeem(0)
      setPaymentMethod('cash')
      setSelectedAccount('')

      await loadProducts()
    } catch {
      toast.error('Failed to complete sale')
    }
  }

  // Handle reset
  const handleReset = (): void => {
    cart.clearCart()
    setSelectedCustomer(null)
    setCustomerSearch('')
    setCashReceived('')
    setDiscountPercent('')
    setPointsToRedeem(0)
    setPaymentMethod('cash')
    setSelectedAccount('')
    toast.success('POS reset successfully')
  }

  // Handle account selection
  const handleAccountSelect = (accountId: string, accountType: string): void => {
    setSelectedAccount(accountId)
    setPaymentMethod(accountType)
  }

  // Effects
  useEffect(() => {
    const timer = setTimeout(() => {
      void searchProducts()
    }, 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  useEffect(() => {
    void loadInventory()
    void loadAccounts()
    searchInputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      if (e.key === 'Enter' && barcodeBuffer) {
        void handleBarcodeSearch(barcodeBuffer)
        setBarcodeBuffer('')
        return
      }

      if (e.key.length === 1) {
        setBarcodeBuffer((prev) => prev + e.key)

        if (barcodeTimerRef.current) {
          clearTimeout(barcodeTimerRef.current)
        }
        barcodeTimerRef.current = setTimeout(() => {
          setBarcodeBuffer('')
        }, 100)
      }
    }

    window.addEventListener('keypress', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
      if (barcodeTimerRef.current) {
        clearTimeout(barcodeTimerRef.current)
      }
    }
  }, [barcodeBuffer, handleBarcodeSearch])

  useEffect(() => {
    if (customerSearch && !selectedCustomer) {
      const timer = setTimeout(() => {
        void searchCustomers()
        setShowCustomerDropdown(true)
      }, 300)
      return () => clearTimeout(timer)
    } else if (!customerSearch) {
      setCustomers([])
      setShowCustomerDropdown(false)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerSearch])

  return {
    // State
    searchTerm,
    products,
    inventory,
    accounts,
    customerSearch,
    customers,
    selectedCustomer,
    showCustomerDropdown,
    loading,
    cashReceived,
    selectedAccount,
    discountPercent,
    pointsToRedeem,
    searchInputRef,
    cart,
    taxRate,
    showSaleCompleteDialog,
    completedSaleDetails,
    storeName,
    storeAddress,
    storePhone,

    // Computed values
    currencySymbol: getCurrencySymbol(),
    total: calculateTotal(),
    change: calculateChange(),
    maxRedeemablePoints: getMaxRedeemablePoints(),
    pointValue: loyaltyPointsRedemptionValue,

    // Handlers
    setSearchTerm,
    setCustomerSearch,
    setCashReceived,
    setDiscountPercent,
    setPointsToRedeem,
    setShowCustomerDropdown,
    setShowSaleCompleteDialog,
    addToCart,
    selectCustomer,
    clearCustomer,
    handleCheckout,
    handleReset,
    handleAccountSelect
  }
}
