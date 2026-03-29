$base = "e:\js basics\coir_web\sml-agro-backend"

# Directories to create
$dirs = @(
    "src\main\java\com\smlagro",
    "src\main\java\com\smlagro\model",
    "src\main\java\com\smlagro\repository",
    "src\main\java\com\smlagro\dto\request",
    "src\main\java\com\smlagro\dto\response",
    "src\main\java\com\smlagro\service",
    "src\main\java\com\smlagro\service\impl",
    "src\main\java\com\smlagro\controller",
    "src\main\java\com\smlagro\security",
    "src\main\java\com\smlagro\config",
    "src\main\java\com\smlagro\exception",
    "src\main\java\com\smlagro\util",
    "src\main\resources",
    "src\test\java\com\smlagro\service",
    "src\test\java\com\smlagro\controller",
    "src\test\java\com\smlagro\repository"
)

foreach ($d in $dirs) {
    if (!(Test-Path (Join-Path $base $d))) {
        New-Item -ItemType Directory -Force -Path (Join-Path $base $d) | Out-Null
    }
}

# Files to create
$files = @(
    "pom.xml",
    "src\main\java\com\smlagro\SmlAgroApplication.java",
    "src\main\java\com\smlagro\model\User.java",
    "src\main\java\com\smlagro\model\UserRole.java",
    "src\main\java\com\smlagro\model\Product.java",
    "src\main\java\com\smlagro\model\ProductCategory.java",
    "src\main\java\com\smlagro\model\Inquiry.java",
    "src\main\java\com\smlagro\model\InquiryStatus.java",
    "src\main\java\com\smlagro\model\Priority.java",
    "src\main\java\com\smlagro\model\CustomizationOption.java",
    "src\main\java\com\smlagro\model\OptionType.java",
    "src\main\java\com\smlagro\model\CustomInquiry.java",
    "src\main\java\com\smlagro\model\ChatSession.java",
    "src\main\java\com\smlagro\model\Order.java",
    "src\main\java\com\smlagro\model\OrderStatus.java",
    "src\main\java\com\smlagro\repository\UserRepository.java",
    "src\main\java\com\smlagro\repository\ProductRepository.java",
    "src\main\java\com\smlagro\repository\InquiryRepository.java",
    "src\main\java\com\smlagro\repository\CustomizationOptionRepository.java",
    "src\main\java\com\smlagro\repository\CustomInquiryRepository.java",
    "src\main\java\com\smlagro\repository\ChatSessionRepository.java",
    "src\main\java\com\smlagro\repository\OrderRepository.java",
    "src\main\java\com\smlagro\dto\request\LoginRequest.java",
    "src\main\java\com\smlagro\dto\request\RegisterRequest.java",
    "src\main\java\com\smlagro\dto\request\InquiryRequest.java",
    "src\main\java\com\smlagro\dto\request\ProductRequest.java",
    "src\main\java\com\smlagro\dto\request\CustomizationRequest.java",
    "src\main\java\com\smlagro\dto\request\ChatRequest.java",
    "src\main\java\com\smlagro\dto\response\AuthResponse.java",
    "src\main\java\com\smlagro\dto\response\InquiryResponse.java",
    "src\main\java\com\smlagro\dto\response\ProductResponse.java",
    "src\main\java\com\smlagro\dto\response\DashboardStatsResponse.java",
    "src\main\java\com\smlagro\dto\response\ChartDataResponse.java",
    "src\main\java\com\smlagro\dto\response\ApiResponse.java",
    "src\main\java\com\smlagro\service\UserService.java",
    "src\main\java\com\smlagro\service\ProductService.java",
    "src\main\java\com\smlagro\service\InquiryService.java",
    "src\main\java\com\smlagro\service\CustomizationService.java",
    "src\main\java\com\smlagro\service\ChatService.java",
    "src\main\java\com\smlagro\service\DashboardService.java",
    "src\main\java\com\smlagro\service\OrderService.java",
    "src\main\java\com\smlagro\service\impl\UserServiceImpl.java",
    "src\main\java\com\smlagro\service\impl\ProductServiceImpl.java",
    "src\main\java\com\smlagro\service\impl\InquiryServiceImpl.java",
    "src\main\java\com\smlagro\service\impl\CustomizationServiceImpl.java",
    "src\main\java\com\smlagro\service\impl\ChatServiceImpl.java",
    "src\main\java\com\smlagro\service\impl\DashboardServiceImpl.java",
    "src\main\java\com\smlagro\service\impl\OrderServiceImpl.java",
    "src\main\java\com\smlagro\controller\AuthController.java",
    "src\main\java\com\smlagro\controller\PublicProductController.java",
    "src\main\java\com\smlagro\controller\PublicInquiryController.java",
    "src\main\java\com\smlagro\controller\PublicChatController.java",
    "src\main\java\com\smlagro\controller\PublicCustomizationController.java",
    "src\main\java\com\smlagro\controller\AdminInquiryController.java",
    "src\main\java\com\smlagro\controller\AdminProductController.java",
    "src\main\java\com\smlagro\controller\AdminUserController.java",
    "src\main\java\com\smlagro\controller\AdminDashboardController.java",
    "src\main\java\com\smlagro\controller\AdminOrderController.java",
    "src\main\java\com\smlagro\security\SecurityConfig.java",
    "src\main\java\com\smlagro\security\JwtUtil.java",
    "src\main\java\com\smlagro\security\JwtFilter.java",
    "src\main\java\com\smlagro\security\UserDetailsServiceImpl.java",
    "src\main\java\com\smlagro\config\CorsConfig.java",
    "src\main\java\com\smlagro\config\DataLoader.java",
    "src\main\java\com\smlagro\config\WebConfig.java",
    "src\main\java\com\smlagro\exception\GlobalExceptionHandler.java",
    "src\main\java\com\smlagro\exception\ResourceNotFoundException.java",
    "src\main\java\com\smlagro\exception\BadRequestException.java",
    "src\main\java\com\smlagro\exception\UnauthorizedException.java",
    "src\main\java\com\smlagro\util\Constants.java",
    "src\main\java\com\smlagro\util\DateUtils.java",
    "src\main\resources\application.properties",
    "src\main\resources\application-dev.properties",
    "src\main\resources\application-prod.properties",
    "src\main\resources\data.sql"
)

foreach ($f in $files) {
    $path = Join-Path $base $f
    if (!(Test-Path $path)) {
        New-Item -ItemType File -Path $path | Out-Null
    }
}
