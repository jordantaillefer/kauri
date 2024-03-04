import { PrismaClient } from "@prisma/client"
import { CATEGORIE } from "~/.server/exercice/domain/categorie"

const prisma = new PrismaClient()

export const seedExercice = async () => {
  await Promise.all(
    [
      createExercicePectoraux("d064a332-29b9-4998-9fb3-f1fd253aeb30", "Développé assis à la machine convergente"),
      createExercicePectoraux("280282ad-abba-45f9-965f-b53f96f92e8d", "Développé couché avec haltères"),
      createExercicePectoraux("0d46b051-a290-40c9-a7cd-419d29a3bc12", "Développé couché à la barre"),
      createExercicePectoraux("abd6e3fb-f5aa-49ca-89cd-74d68c12097c", "Développé couché à la machine convergente"),
      createExercicePectoraux("b2a0a1a9-fb23-40db-99df-e425dcf39316", "Développé décliné avec haltères"),
      createExercicePectoraux("c7aee8c7-36df-45ba-b1d9-ac012aa41baf", "Développé décliné à la barre"),
      createExercicePectoraux("c1d34f72-439b-40a1-9fcb-9c39213187a3", "Développé incliné avec haltères"),
      createExercicePectoraux("deb1093d-7475-4c15-aba4-440115d50046", "Développé incliné à la barre"),
      createExercicePectoraux("d9abbb65-a437-49d7-bd34-ddf8674bc60c", "Développé incliné à la machine convergente"),
      createExercicePectoraux("81538984-38d8-4b19-9569-192135486f38", "Dips prise large buste penché"),
      createExercicePectoraux("b398efa2-88d7-4ff7-b50b-e76c179b9303", "Pull over avec barre ou haltère"),
      createExercicePectoraux("8cddfc43-8714-4ed4-8f10-7a0a0473aec0", "Pull over en travers d’un banc avec barre ou haltère"),
      createExercicePectoraux("b3cde56b-17df-47d9-a1e1-44256cb6bdc9", "Écarté couché avec haltères"),
      createExercicePectoraux("d998ee14-de38-4ff3-b83e-318cdbb3556d", "Écarté décliné avec haltères"),
      createExercicePectoraux("4cfb2ecd-3d61-46ad-92fd-94dca87ac088", "Écarté incliné avec haltères"),
      createExercicePectoraux("ed8025ba-edde-46ff-8bfd-ffdeff562351", "Écarté pectoraux à la machine"),
      createExercicePectoraux("2d499095-94c0-4db1-9464-8ff8dcff1da4", "Pompes prise large au sol"),
      createExercicePectoraux("a4456262-6820-4838-a70d-743e0a88cc30", "Pull over à la poulie basse"),
      createExercicePectoraux("c26f4b1c-e55e-4971-af29-21836aae2535", "Écarté à la poulie vis à vis basse"),
      createExercicePectoraux("8695036c-e2d9-417f-95ad-d067079c859f", "Écarté à la poulie vis à vis haute"),
      createExercicePectoraux("0aaff0b6-cff5-4d72-a348-7171ae2194d8", "Développé couché à la machine"),

      createExerciceDeltoide("6be33447-b44d-4601-8945-fb4a460100ee", "Élévation latérale à la poulie"),
      createExerciceDeltoide("9170dd10-880f-4bb7-813b-a2c6061cf32b", "Développé épaules avec haltères"),
      createExerciceDeltoide("adf9a3ef-7eff-4288-8098-2904fe1910d5", "Développé épaules à la machine convergente"),
      createExerciceDeltoide("9870c2ec-a512-432c-b28b-1eb27437c3b1", "Développé militaire avec barre"),
      createExerciceDeltoide("0d2b252a-54a6-49a7-b823-2ff715254327", "Développé nuque avec barre"),
      createExerciceDeltoide("314d37de-a7e2-4d99-aa34-872fdc5b6252", "Oiseau à la poulie basse"),
      createExerciceDeltoide("539fe5ff-8c53-4b03-af92-44d6c063e65f", "Oiseau/Rowing avec haltères"),
      createExerciceDeltoide("e5916717-8861-4052-9a5d-bdc67b21783a", "Rowing assis à la machine coudes ouverts"),
      createExerciceDeltoide("962eebb0-a94c-46d6-81d0-82434d3b9b5b", "Rowing assis à la poulie basse coudes ouverts"),
      createExerciceDeltoide("d514388e-1e2e-4126-9a52-0da65dd691ec", "Rowing à la poulie basse sur banc incliné coudes ouverts"),
      createExerciceDeltoide("857e9224-24f7-4408-863e-e0ae44881713", "Rowing à la poulie haute sur banc incliné coudes ouverts"),
      createExerciceDeltoide("39775fab-c011-4577-86b6-0aa0cd4dd957", "Rowing à la T-bar coudes ouverts"),
      createExerciceDeltoide("4cca515f-c675-468d-9e7b-7f40b88ced40", "Rowing barre coudes ouverts"),
      createExerciceDeltoide("930ca3db-fba4-44da-b6f2-516c10c63400", "Rowing debout à la poulie basse"),
      createExerciceDeltoide("ecfe5908-e127-4ef2-bd76-fb5f5e7dbfe0", "Rowing debout prise large avec barre"),
      createExerciceDeltoide("54f93bfd-631d-48bb-af37-1ce5ddb97d68", "Élévation latérale avec haltères"),
      createExerciceDeltoide("8d676209-147d-43f9-ab9f-84695c4da728", "Élévation latérale à un bras penché sur le côté"),
      createExerciceDeltoide("04b9a2d3-17fc-4578-aca7-a89f41f89590", "Élévation latérale à un bras sur banc incliné"),
      createExerciceDeltoide("988ccd05-e393-4af1-ae8f-cc39636af4ba", "Développé épaules Arnold avec haltères"),
      createExerciceDeltoide("c6681786-a098-4373-9570-5496d9b65d2b", "Développé épaules à la machine"),
      createExerciceDeltoide("cd9657ef-d1d5-41f8-956d-1c4937ea1257", "Développé inversé au poids de corps"),
      createExerciceDeltoide("4fcad9da-0249-4130-90d9-a2456d40737e", "Oiseau avec haltères"),
      createExerciceDeltoide("b0ed03ed-9a39-4179-8895-87f2ca38f510", "Oiseau à la machine"),
      createExerciceDeltoide("e958dc2c-4237-4f76-b6f7-3ef9dba1ab53", "Oiseau à la poulie haute"),
      createExerciceDeltoide("30ebdd04-6275-49e9-8ea9-9ceac41646c8", "Oiseau à un bras allongé"),
      createExerciceDeltoide("fd7cabdf-43db-403a-ae71-44493461bf89", "Oiseau sur banc incliné avec haltères"),
      createExerciceDeltoide("b19ece61-ac64-457d-b6f8-aee573d5e639", "Pompes indiennes"),
      createExerciceDeltoide("74ba1d60-0900-4a97-bc63-482414ffda84", "Élévation frontale avec haltères"),
      createExerciceDeltoide("cac59339-e377-456c-a3cb-b930ae98758c", "Élévation frontale avec une barre"),
      createExerciceDeltoide("65e3ca87-b328-4f83-8e9b-1e5bcc2cee6c", "Élévation frontale à la poulie"),
      createExerciceDeltoide("02416fc9-f756-4cce-85a5-3c7fa2a322a7", "Élévation frontale sur banc incliné avec barre ou haltères"),
      createExerciceDeltoide("9e682d9d-436d-40ff-9abc-2b50a98daa6d", "Élévation latérale à la machine"),
      createExerciceDeltoide("c272d562-6c14-44c1-b222-39b958e40cbf", "Rotation externe debout avec barre"),
      createExerciceDeltoide("324aae3c-9a02-4d3d-bcb1-1d6ab96b7d2e", "Rotation interne allongé à la poulie basse"),
      createExerciceDeltoide("53027520-807f-4b66-9846-f55dbb6ba990", "Rotation interne assis à la poulie basse"),
      createExerciceDeltoide("042c48c4-95a5-4ce4-8f3f-9d56383b37ba", "Rotation interne avec haltère"),
      createExerciceDeltoide("556ad3cd-b3cc-47b9-8ffa-5c74ec27c2de", "Rotation interne debout à la poulie"),
      createExerciceDeltoide("bae05b8e-7e94-483e-b118-7d966798014d", "L-Fly allongé à la poulie basse"),
      createExerciceDeltoide("cd8c9059-d6c4-4d73-92c2-27eb02d2f0ff", "L-Fly assis à la poulie basse"),
      createExerciceDeltoide("f7b27e04-322f-4c9a-bba9-047929f4ef5a", "L-Fly avec haltère"),
      createExerciceDeltoide("06ba9929-4076-4ac2-9e73-42832d64b905", "L-Fly debout à la poulie"),

      createExerciceTrapeze("c239b9ba-ebae-4414-8ed5-3fbb0adfce65", "Rowing à la T-bar"),
      createExerciceTrapeze("9a24b29a-c936-4a84-a819-abea3381877a", "Rowing à un bras avec haltère"),
      createExerciceTrapeze("d70f635b-2b81-4f6a-b3b8-d3709fb26b0b", "Rowing à un bras à la machine"),
      createExerciceTrapeze("19f5c17a-9de4-4bf9-a0cd-f6aabf9deef6", "Rowing barre à la Yates en pronation"),
      createExerciceTrapeze("f7ef1088-ab98-40b8-b54d-18202ce69469", "Rowing barre à la Yates en supination"),
      createExerciceTrapeze("d0dbd3ce-7325-4ced-9472-847fcf0c05e2", "Rowing barre buste penché en pronation"),
      createExerciceTrapeze("12123d76-31ca-489d-9c6d-2af6c0dc00d1", "Rowing barre en supination"),
      createExerciceTrapeze("34272e34-8d3b-4da5-913d-d4e8e3a5f4da", "Soulevé de terre partiel avec barre"),
      createExerciceTrapeze("72db5951-a153-41bc-bdcf-c93779155a28", "Rowing assis à la machine"),
      createExerciceTrapeze("11f21181-d0f7-43c3-92d8-37a722ad0bcd", "Rowing assis à la poulie basse à un bras"),
      createExerciceTrapeze("9a8f4b21-18ca-44a2-a668-c17e19a7f5c6", "Rowing assis à la poulie basse en pronation"),
      createExerciceTrapeze("89a87af3-5b13-4604-bc46-1a1169b05fc4", "Rowing assis à la poulie basse en supination"),
      createExerciceTrapeze("b32e181e-47f4-4eb4-a730-9540e9ff13a7", "Rowing assis à la poulie basse prise neutre"),
      createExerciceTrapeze("2737d2b0-0ba5-4dcc-bcb4-4e43dce0de25", "Rowing à la poulie basse sur banc incliné"),
      createExerciceTrapeze("41537c48-7bdf-4c15-8254-cde317be7e7c", "Rowing à la poulie haute à un bras"),
      createExerciceTrapeze("f849903e-e9c6-4a3a-870b-ad9d2763e91e", "Rowing à la poulie haute en prise neutre"),
      createExerciceTrapeze("5d570089-feb7-40e0-a663-5bfe9985195f", "Rowing à la poulie haute en pronation"),
      createExerciceTrapeze("1d712da0-b336-4aa4-bbf0-e15051d4b4a0", "Rowing à la poulie haute en supination"),
      createExerciceTrapeze("367e90e0-55b4-4933-8a5c-bc1db85c4de3", "Rowing à la T-bar à la machine"),
      createExerciceTrapeze("b864b436-5e71-400c-8ede-51a4974575fd", "Rowing à un bras à la poulie basse"),
      createExerciceTrapeze("f3f3c8db-9fdf-4fc8-8ab1-4e4cc04ba30a", "Rowing barre allongé sur banc"),
      createExerciceTrapeze("2e3270a6-b1da-4134-9d4c-54aba5f81df8", "Rowing debout prise serrée avec barre"),
      createExerciceTrapeze("7192aac8-17d5-45ca-82dc-33f4091cd88f", "Rowing inversé au poids de corps"),
      createExerciceTrapeze("4f6af86b-53c8-49ba-b96c-38bf4fdb8385", "Shrug avec barre"),
      createExerciceTrapeze("0ff58746-ce12-461c-8856-f69f50328d66", "Shrug avec haltères"),
      createExerciceTrapeze("6ee92a25-87d8-411f-b0c9-ea949d06dcb4", "Shrug à la machine"),
      createExerciceTrapeze("675a70cd-9ea3-40d9-9b83-75c3e9c7b86a", "Shrug à la machine à mollets"),
      createExerciceTrapeze("1b15b2c8-840a-4d6e-ada3-abfc8949ebea", "Shrug à la machine convergente"),
      createExerciceTrapeze("812c4f02-f696-488d-83f9-04c724a6cb16", "Shrug à la poulie"),

      createExerciceDorsaux("344cbe32-b4ac-4282-aca3-d1cc834445a3", "Traction prise large devant à la barre fixe"),
      createExerciceDorsaux("a5b5999f-8b43-4607-accb-36f1bcd5140a", "Traction prise large nuque à la barre fixe"),
      createExerciceDorsaux("1b3844b0-8bba-4424-ac84-a69d6d84bb28", "Traction prise neutre à la barre fixe"),
      createExerciceDorsaux("e3b5cf37-d6fc-4b4b-9c85-a76d52b668e2", "Traction prise serrée en pronation à la barre fixe"),
      createExerciceDorsaux("1ed1c31a-d46d-4dbf-9d52-b5a38f9a6e2a", "Traction prise supination cambré à la barre fixe"),
      createExerciceDorsaux("77a341a8-9199-4e12-902e-da0399a1d495", "Pull over assis à la machine"),
      createExerciceDorsaux("0cf1d833-e281-4029-bccf-6abc8820bac1", "Traction à la machine convergente"),
      createExerciceDorsaux("f4d12603-6f1c-4409-b1d3-68efd8199167", "Traction à la poulie haute à un bras"),
      createExerciceDorsaux("d3c5a5be-5f5f-4486-b017-b5637773a43c", "Traction à la poulie haute devant"),
      createExerciceDorsaux("a8cde3ac-61af-464c-a666-a3112ecee9be", "Traction à la poulie haute nuque"),
      createExerciceDorsaux("454443aa-71db-433b-ac5b-a975cf7d699f", "Traction à la poulie haute prise neutre"),
      createExerciceDorsaux("f0302ff7-4a1c-4ba3-bf7a-fba61f949ca2", "Traction à la poulie haute prise serrée en pronation"),
      createExerciceDorsaux("fa306f5b-aa0c-4a43-9950-c2efe63b702c", "Traction à la poulie haute prise supination"),
      createExerciceDorsaux("c6328fa0-a0a3-43d7-836e-f32ee6b0878a", "Pull over debout à la poulie haute"),
      createExerciceDorsaux("eb2b7040-d8c7-4bfc-ac8a-4d38c332badc", "Traction à la machine"),

      createExerciceTriceps("a19b6f22-c3f7-4842-8346-1b554fae9b31", "Barre au front allongé à la poulie basse"),
      createExerciceTriceps("b3aabd3e-f78a-439e-80fd-9e0b026028d9", "Barre au front triceps avec barre ou haltères"),
      createExerciceTriceps("a42c1764-f46d-4b21-b50d-b0030ec0f2b0", "Développé couché prise serrée à la barre"),
      createExerciceTriceps("71c81ee6-8f4a-40ac-bd56-b1949cecbed7", "Dips à la machine"),
      createExerciceTriceps("51dd6070-1ebf-46c2-b327-d24067849b61", "Dips entre deux bancs"),
      createExerciceTriceps("7764f3cc-2a71-4ccd-83de-58a0df647e20", "Dips prise serrée"),
      createExerciceTriceps("996259f2-5748-4894-8f29-ea6d5cc588b4", "Extension des triceps à la poulie haute à genoux"),
      createExerciceTriceps("9683f10e-102f-4bd7-9dff-7aca106b1071", "Extension des triceps contre un mur au poids de corps"),
      createExerciceTriceps("c3f3474d-d0d4-48b3-a88f-4138fa4063a9", "Extension nuque avec barre ou haltère"),
      createExerciceTriceps("87bb6fc4-6e4f-4ea5-a0df-620df209b71d", "Extension nuque à la poulie"),
      createExerciceTriceps("e7690b22-43e9-4738-ba6e-8d59a9b01b74", "Extension nuque à un bras avec haltère"),
      createExerciceTriceps("ca261272-c0a9-4cfc-b50c-7c87b0dba01f", "Magic tRYCeps avec barre ou haltère"),
      createExerciceTriceps("e09b3856-c503-4798-83c8-728946cdc4a8", "Pull over Press avec barre ou haltère"),
      createExerciceTriceps("044709cc-6b3c-4620-9c60-4556b6894309", "Extension des triceps à la machine"),
      createExerciceTriceps("7f6431dd-c960-4b73-aeeb-41dcc53bacc0", "Extension des triceps bras à 180 degrés avec barre ou haltères"),
      createExerciceTriceps("f035b82d-7de3-4def-b956-99a46124aa60", "Extension des triceps buste penché à la poulie haute"),
      createExerciceTriceps("4a1db7bb-5ce7-4a62-b386-2147213fb9df", "Pompes prise serrée au sol"),
      createExerciceTriceps("cfe03e32-ee61-480e-8750-8413087c20b9", "Tate Press avec haltères"),
      createExerciceTriceps("3cc8e0c2-de39-4b21-acb4-f4992ca2505b", "Tate Press à un bras avec haltère"),
      createExerciceTriceps("338f0538-0149-4f1c-8e02-ef1f75b11b6a", "Extension des triceps à la poulie avec la corde"),
      createExerciceTriceps("53409e49-8d8e-476a-a453-c9f0e821b7a5", "Extension des triceps à la poulie à un bras"),
      createExerciceTriceps("2ca88270-f045-46ba-8926-6ce67f80bdfc", "Extension des triceps à la poulie coudes écartés"),
      createExerciceTriceps("5c6c328a-31b2-40d0-86cb-eb97d801e57e", "Extension des triceps à la poulie en pronation"),
      createExerciceTriceps("aa0b2dbd-0d07-4440-ba8b-22a7bd09a4e9", "Extension des triceps à la poulie en supination"),
      createExerciceTriceps("e38c6c2a-c70a-4fd1-89d2-a57348d74f55", "Kickback avec haltère"),
      createExerciceTriceps("1accfca3-36ac-49c7-9fc1-c6b4648df74d", "Kickback à la poulie"),

      createExerciceBiceps("28e7c170-67e5-41f0-ac77-545c06351345", "Curl au pupitre avec barre"),
      createExerciceBiceps("7b674ca1-340d-4160-be19-a1d8a6a40790", "Curl incliné avec haltères"),
      createExerciceBiceps("6a1d74f3-153c-4f0a-a997-5e7fd8a306ca", "Curl marteau en travers avec haltères"),
      createExerciceBiceps("997d34ff-b5eb-4f4b-858b-10cfd25577f2", "Traction prise supination non cambré à la barre fixe"),
      createExerciceBiceps("d85ef07a-3dde-4b31-993a-95fa165169a7", "Curl allongé à la poulie basse"),
      createExerciceBiceps("808acdbe-af06-4bf3-bdd2-0ff4c68b0e5a", "Curl allongé à la poulie haute"),
      createExerciceBiceps("af4c8748-8dac-4a30-89ab-9b809347fcd2", "Curl araignée avec barre"),
      createExerciceBiceps("5040d98a-9d50-4b2c-838d-7d832a7146e7", "Curl au pupitre à la poulie"),
      createExerciceBiceps("f64837aa-0630-4b08-a0d3-7fdc0519ae11", "Curl avec haltères"),
      createExerciceBiceps("016b7358-c229-4111-84fa-80edfbbb5161", "Curl à la barre"),
      createExerciceBiceps("642138dc-8b1d-4e60-8bfc-b3c0228b6eb2", "Curl à la poulie basse"),
      createExerciceBiceps("c64557cf-8e4e-431d-9a05-5f7da12c544a", "Curl marteau avec haltères"),
      createExerciceBiceps("db3e101c-f6c3-492c-bbbf-67139d8a464a", "Curl au pupitre à la machine"),
      createExerciceBiceps("d2bb6007-cba5-4c5e-ab72-6c3379c1a99f", "Curl à la poulie vis à vis"),
      createExerciceBiceps("d6e66ab1-fdac-4825-9a63-badcf41ff8fa", "Curl concentré avec haltère"),

      createExerciceAvantBras("d6d2dc77-4f5f-439a-a159-b64de75264e2", "Curl inversé allongé à la poulie basse"),
      createExerciceAvantBras("692129a2-2174-4d34-acda-1cba799b1040", "Curl inversé allongé à la poulie haute"),
      createExerciceAvantBras("de992bbc-6fba-40d4-ba1f-bd1cc9c381d1", "Curl inversé au pupitre avec barre"),
      createExerciceAvantBras("015251ca-2902-413a-9cc0-2162d16feb70", "Curl inversé au pupitre à la poulie"),
      createExerciceAvantBras("ff1561eb-b5fd-4f07-a13b-6422f41ab0e6", "Curl inversé avec barre"),
      createExerciceAvantBras("78031c9a-a993-49b8-bcd6-2574ef1b8a55", "Curl inversé à la poulie"),
      createExerciceAvantBras("a66cedc8-748a-400d-9b81-523747841ca2", "Bobine Andrieux - Extension"),
      createExerciceAvantBras("64d732b7-a9eb-45aa-995d-ed4d5ef7be95", "Bobine Andrieux - Flexion"),
      createExerciceAvantBras("540bc28f-57a0-4fe5-854d-114c0d96282b", "Extension des poignets avec barre"),
      createExerciceAvantBras("8db2e34f-bc35-4d3d-a042-c21ec7ba371d", "Flexion des poignets avec barre"),

      createExerciceAbdominaux("3c34b4c5-0953-4560-9a02-9d4c9ec59beb", "Crunch abdominaux avec l’Abmat"),
      createExerciceAbdominaux("f2eeccd8-0b6e-44a5-87eb-b88fb4dbb48a", "Crunch à la poulie haute"),
      createExerciceAbdominaux("105fc206-e1a0-434e-8066-de12b85b3742", "Enroulement de bassin au sol avec l’Abmat"),
      createExerciceAbdominaux("990c0350-f1cd-485a-99ac-204c1b0d9d9a", "Enroulement de bassin suspendu à la barre fixe"),
      createExerciceAbdominaux("e211cd97-7dd7-4ad0-b07f-18790fa60295", "Obliques sur banc à lombaires"),
      createExerciceAbdominaux("fe7041ec-633d-42c1-8fa7-a2093987a01f", "Crunch abdominaux au sol"),
      createExerciceAbdominaux("f4eb3a21-9161-4c7d-9b21-d2a62a9bb4c6", "Crunch abdominaux à la machine"),
      createExerciceAbdominaux("ab1eab9d-72c5-4fe9-950c-27deff27b358", "Crunch abdominaux sur la Swiss Ball"),
      createExerciceAbdominaux("374c0a03-afd7-436c-ae18-3a219b68f6dc", "Crunch oblique au sol"),
      createExerciceAbdominaux("b3955703-2c50-4f2a-9010-b836a1592511", "Enroulement de bassin au sol"),
      createExerciceAbdominaux("01e43585-0ec5-4cf1-bbd5-6a57fb44752f", "Obliques avec l’Abmat"),
      createExerciceAbdominaux("00ee75bc-c8c5-499c-b618-3d7cf5159a08", "Obliques sur la Swiss Ball"),
      createExerciceAbdominaux("12712649-6b78-4f80-818c-3be46745c50b", "Obliques suspendu à la barre fixe"),
      createExerciceAbdominaux("b0213d20-224e-42d4-9c56-b045103fddbe", "Rotation à la machine"),
      createExerciceAbdominaux("a4a340ed-905b-4c2f-a321-278d5f1f012b", "Crunch abdominaux avec rotation au sol"),
      createExerciceAbdominaux("82948f1c-a3f4-4667-8208-2aabe841ec5e", "Drapeau du dragon"),
      createExerciceAbdominaux("5bc5bb8c-7d26-4dc1-835d-8b06e1db7ada", "Flexion latérale avec haltère"),
      createExerciceAbdominaux("51d906cc-832a-40c7-a729-1c3349ee22eb", "Gainage abdominal frontal"),
      createExerciceAbdominaux("1956fab2-204a-4273-8dc9-453691710a6a", "Gainage abdominal oblique"),
      createExerciceAbdominaux("ac82ad07-4e9c-4528-911c-fdb7e26a719b", "Rotation debout avec balais"),
      createExerciceAbdominaux("acdfa41d-7d50-4b3b-9c52-707ab43ce20b", "Vacuum"),

      createExerciceFessiers("5527fe82-511c-47c2-a0bf-e8901d4a2510", "Hip thrust à la barre"),
      createExerciceFessiers("253b243f-2cca-45aa-be19-494c69099930", "Soulevé de terre avec barre"),
      createExerciceFessiers("d965fd36-d803-40e6-a57d-2218d65b7d8c", "Soulevé de terre sumo avec barre"),
      createExerciceFessiers("a566e708-af42-439c-b2ed-2c5cdb12cb4f", "Extension inversé à la machine"),
      createExerciceFessiers("8591fd0e-63e5-4c04-946d-125e5e28a5bb", "Fente arrière glissée avec Valslide"),
      createExerciceFessiers("d104ec05-0266-4604-a58f-87c64dbd393b", "Fente à la Smith machine"),
      createExerciceFessiers("f0cacbfa-1392-4d27-9cad-35abf2bfda14", "Abducteurs allongé avec lest cheville"),
      createExerciceFessiers("4cc7ac1e-0fa0-47eb-98b5-ef3d534a8122", "Abducteurs assis à la machine"),
      createExerciceFessiers("8d284655-feca-4a7c-b439-c0a4274981a9", "Abducteurs à la machine"),
      createExerciceFessiers("2a3869a7-e0ff-4302-b8ed-2673483f198d", "Abducteurs à la poulie"),
      createExerciceFessiers("be45eaa2-749b-452a-90df-5bb8b214e0a2", "Extension de la hanche à la machine"),
      createExerciceFessiers("bb67c135-4e6f-416c-8647-4e04dbbbf98d", "Fente avec barre"),
      createExerciceFessiers("8077b009-2032-4348-ab27-47715d7e0561", "Fente en marchant avec barre ou haltères"),
      createExerciceFessiers("5e296521-d860-46bb-9e9f-ac2af577b3c6", "Fente en reculant avec barre ou haltères"),

      createExerciceQuadriceps("0d8ab4b1-fa59-4351-b833-41e5194f1f4d", "Hack squat à la machine"),
      createExerciceQuadriceps("716fc07b-1bd9-4869-a169-ac12da7b8ec2", "Presse à cuisses allongé"),
      createExerciceQuadriceps("dc6852f2-4903-49a3-8aa2-ea6a4c8526cc", "Presse à cuisses assis"),
      createExerciceQuadriceps("bf740ad3-6954-4477-af05-a3f97663770f", "Presse à cuisses incliné"),
      createExerciceQuadriceps("0afd26fe-ff14-40d8-8a2a-b3b6755443a2", "Squat avant avec barre"),
      createExerciceQuadriceps("16b19a8d-66f5-460e-af81-87ea9a853674", "Squat avec barre derrière la nuque"),
      createExerciceQuadriceps("10e5c6fb-1c5c-4437-9521-b4730a497667", "Squat sumo avec barre"),
      createExerciceQuadriceps("7366263c-60db-4b22-a202-a8153209d3fe", "Fente latérale avec barre"),
      createExerciceQuadriceps("aa2c1145-85b2-4659-b5a0-bdf3a3385738", "Gobelet Squat avec haltère"),
      createExerciceQuadriceps("23a334c3-d0d1-43c3-a9e2-b503341bb35d", "Hack squat avec une barre"),
      createExerciceQuadriceps("9395a35b-4476-408c-8958-e55119f68f24", "Montée sur banc avec barre ou haltères"),
      createExerciceQuadriceps("c90e232e-3fca-4e7f-aa6a-7fd9299bfdfc", "Squat avec ceinture de lest"),
      createExerciceQuadriceps("37df9cf1-1ad8-4c2c-b6fe-5190d7c3d1c5", "Squat à la machine"),
      createExerciceQuadriceps("3c87da1a-9d5f-4bd4-9c0b-e5ca4d5332c7", "Squat à la machine à mollets"),
      createExerciceQuadriceps("a59baf94-f227-4905-a437-e1e80b3e521f", "Squat à la Smith machine"),
      createExerciceQuadriceps("48ab3862-1f1e-4e39-a158-a6ac07ef2c98", "Squat à une jambe au poids de corps"),
      createExerciceQuadriceps("5adf268d-cf20-4ebc-80d7-7e81fabd64f3", "Squat bulgare avec barre ou haltères"),
      createExerciceQuadriceps("4a1349a4-8acd-422d-8d38-6a569214c156", "Adducteurs assis à la machine"),
      createExerciceQuadriceps("1a30f344-c6ae-4f89-acf6-53cc92c4b0fe", "Adducteurs à la machine"),
      createExerciceQuadriceps("d12b8e5c-4015-4df5-9a09-38f1ac99bb1d", "Adducteurs à la poulie"),
      createExerciceQuadriceps("f8d6ff9e-a624-4f52-813c-8682ad1fc625", "Flexion de la hanche à une jambe à la machine"),
      createExerciceQuadriceps("d1258850-3f11-4298-8651-79ba0e0de339", "Leg extension allongé à la machine"),
      createExerciceQuadriceps("666cf795-369b-4838-be8e-498ff960e5ed", "Leg extension assis à la machine"),
      createExerciceQuadriceps("8e2e88d2-a10a-4c2a-af2b-d18427dd8eb9", "Relevé de buste au sol ou sur banc incliné"),
      createExerciceQuadriceps("9fb92843-acd6-4dc1-a47b-d4de093d5b31", "Relevé de genoux allongé au sol ou sur banc incliné"),
      createExerciceQuadriceps("5c178d06-c3fd-4f1f-b620-768f1ddd218a", "Relevé de genoux sur banc"),
      createExerciceQuadriceps("db3ac998-894e-4fad-979c-d981f4302a9b", "Relevé de genoux suspendu à la barre fixe"),
      createExerciceQuadriceps("dd245a62-0638-460d-b200-870a032e0117", "Sissy squat"),
      createExerciceQuadriceps("a6bf5744-a883-4237-96b3-cff27880d723", "Sissy squat à la presse allongé"),
      createExerciceQuadriceps("2e0539c9-cef0-4fcf-a121-2f7d358d5c8a", "Squat avec haltères"),
      createExerciceQuadriceps("1c1d2e0a-1b1b-4e1c-a5fa-0e6986f45299", "Squat indien"),

      createExerciceIschioJambiers("f8fcf4da-e957-4c76-9cee-3363a91a8bf7", "Glute Ham Raise au banc"),
      createExerciceIschioJambiers("318351be-3d9b-47ec-902c-07038c409bb2", "Leg curl assis à la machine"),
      createExerciceIschioJambiers("e24537df-a8e6-4475-b244-a713dd0b6a3c", "Soulevé de terre jambes tendues avec barre ou haltères"),
      createExerciceIschioJambiers("9067c008-7b8e-468f-955d-6b569bbc2cc0", "Extension au banc à lombaires à 45 degrés"),
      createExerciceIschioJambiers("bb7a00ad-e5a7-4f32-9a56-2ee6a2280a71", "Good Morning avec barre"),
      createExerciceIschioJambiers("f71061cf-af8a-4a9a-a462-1dac686de13e", "Leg curl allongé à la machine"),
      createExerciceIschioJambiers("750a884c-8a17-4d1e-9f27-15edd0d86975", "Leg curl debout à une jambe à la machine"),
      createExerciceIschioJambiers("c2de5a26-c3cc-4002-aad1-091d52272f17", "Leg curl debout à une jambe à la poulie"),
      createExerciceIschioJambiers("e4ce6baa-e438-4238-bc1a-3cbc3f557998", "Soulevé de terre jambes tendues à la poulie"),
      createExerciceIschioJambiers("02b8b2d3-a150-4958-805f-400e420bd769", "Extension au banc à lombaires à 90 degrés"),

      createExerciceMollets("4205fce5-7951-4b4e-b12a-625e13df6206", "Chameau à la machine"),
      createExerciceMollets("24e86722-1061-4d5f-9cb3-81a0345a01ef", "Mollets assis jambes tendues à la machine"),
      createExerciceMollets("156fdb00-ca56-44a4-b834-dc0725c14dbd", "Mollets à la presse à cuisses"),
      createExerciceMollets("5dba4e88-3132-4fd1-8b52-18bde3b2682b", "Mollets debout à la machine"),
      createExerciceMollets("583fac57-fce9-4b29-ab12-f9849b5a2574", "Mollets debout à une jambe avec haltère"),
      createExerciceMollets("e0c0b8c2-d60d-4ea9-bea9-9c87fe331bef", "Mollets assis à la machine"),

      createExerciceLombaires("00607108-12a9-4963-b167-a61cbe0f7b57", "Soulevé de terre avec barre"),
      createExerciceLombaires("3bdf4fbf-c068-4dc7-8a46-a78b89a952c7", "Soulevé de terre jambes tendues avec barre ou haltères"),
      createExerciceLombaires("ad5b66a0-eba9-4bf0-8e8f-ee247692eb8e", "Soulevé de terre sumo avec barre"),
      createExerciceLombaires("3cbb5c02-5dc3-4474-985e-8f5346043264", "Enroulement/Déroulement au banc à lombaires"),
      createExerciceLombaires("25a7fd15-65c5-47a1-8a92-fc28555269b9", "Good Morning avec barre"),
      createExerciceLombaires("0b4a02e2-0d3a-40b8-ad9b-f2ae1e72c980", "Soulevé de terre jambes tendues à la poulie"),
      createExerciceLombaires("d5ce25ce-0f6b-456f-9c52-3e065db5ca02", "Exercices d’étirements des lombaires pour la musculation")
    ]
  )
}

const createExercice = (categorie: CATEGORIE) => async (id: string, nomExercice: string) => {
  await prisma.exercice.upsert({
    where: { id },
    update: {},
    create: {
      id,
      nomExercice,
      categorie
    }
  })
}

const createExercicePectoraux = createExercice(CATEGORIE.PECTORAUX)
const createExerciceDeltoide = createExercice(CATEGORIE.DELTOIDE)
const createExerciceTrapeze = createExercice(CATEGORIE.TRAPÈZES)
const createExerciceDorsaux = createExercice(CATEGORIE.DORSAUX)
const createExerciceTriceps = createExercice(CATEGORIE.TRICEPS)
const createExerciceBiceps = createExercice(CATEGORIE.BICEPS)
const createExerciceAvantBras = createExercice(CATEGORIE.AVANTBRAS)
const createExerciceAbdominaux = createExercice(CATEGORIE.ABDOMINAUX)
const createExerciceFessiers = createExercice(CATEGORIE.FESSIERS)
const createExerciceQuadriceps = createExercice(CATEGORIE.QUADRICEPS)
const createExerciceIschioJambiers = createExercice(CATEGORIE.ISCHIOJAMBIERS)
const createExerciceMollets = createExercice(CATEGORIE.MOLLETS)
const createExerciceLombaires = createExercice(CATEGORIE.LOMBAIRES)

seedExercice()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
