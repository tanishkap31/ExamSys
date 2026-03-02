namespace Online_Exam_system.Common
{
    public class Config
    {
        //Local(Himesh)
        //const string dataSource = @"DESKTOP-5ORVV5G\SQLEXPRESS";
        //const string dbName = "DahanuFruitProducts-DB";
        //const string dbUserID = "sa";
        //const string dbPassword = "tft123456";
        // const string dataSource = @"DESKTOP-5ORVV5G\SQLEXPRESS";
        const string dataSource = @"(localdb)\MSSQLLocalDB";
        const string dbName = "Online_exam_system";


        //staging 
        //const string dataSource = @"52.172.226.45";
        //const string dataSource = @"ltplvmscw000000\SQLEXPRESS";
        //const string dbName = "DahanuFruitProducts-DB";
        //const string dbUserID = "sa";
        //const string dbPassword = "tft123456";

        //public static string connectionString = @"Data Source=" + dataSource + "; Initial Catalog=" + dbName + "; User ID=" + dbUserID + "; Password=" + dbPassword + "; MultipleActiveResultSets=true; App=EntityFramework; Encrypt=false; TrustServerCertificate=true;";

        public static string connectionString =
    @"Data Source=" + dataSource +
    "; Initial Catalog=" + dbName +
    "; Integrated Security=True;" +
    " Encrypt=False;" +
    " TrustServerCertificate=True;";

        //Page Size
        public static int pageSize = 50;

        //Date Formats
        public static string dateTimeFormat = "dd MMM yyyy hh:mm tt";
        public static string dateTimeFormatTT = "dd/MM/yyyy hh:mm tt";
        public static string dateFormat = "dd MMM yyyy";
        public static string reverseDateFormat = "yyyy MM dd";
        public static string timeFormat = "hh:mm tt";
        public static string searchDateFormat = "yyyy-MM-dd";
        public const string dateForJSFormat = "yyyy-MM-dd";
        public const string dateForJSFormatTwo = "dd-MM-yyyy";
        public const string dateForPDFPrint = "dd/MM/yyyy";
        public static string yearFormat = "yyyy";
        public static string dateFormatPDFPrint = "dd/MM/yyyy";


        //..Encryption/Decryption..// 
        public static string CryptPassPhrase = "VMIMT2009";
        public static string CryptSaltValue = "MTVMI2009";
        public static string CryptHashAlgorithm = "SHA1";
        public static string CryptPasswordIterations = "2";
        public static string CryptInitVector = "@1B2c3D4e5F6g7H8";
        public static string CryptKeySize = "256";

        public static string categoryImagePath = "/Content/CategoryImages/";

        public static string defaultImageUrl = "/img/default-150x150.png";

        public static string loginEmail = "superadmin@dahanufruitproduct.com";
        public static string loginPassword = "123456";

        //public static string loginEmail = "MASTER";
        //public static string loginPassword = "USER";
    }
}
