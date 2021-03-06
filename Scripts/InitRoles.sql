USE [ResellTicket_FU_Capstone]
GO
INSERT [dbo].[Role] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'Manager', N'Manager', N'MANAGER', NULL)
GO
INSERT [dbo].[Role] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'Staff', N'Staff', N'STAFF', NULL)
GO
INSERT [dbo].[User] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount], [FullName], [IsActive]) VALUES (N'b23c9573-fbef-4624-9b37-3915dcae7119', N'rootadmin', N'ROOTADMIN', N'admin@mail.com', N'ADMIN@MAIL.COM', 0, N'AQAAAAEAACcQAAAAEDk73NfAXTH4xIshA+QXUfyH9UcdriEwxIzaf3u+YeOJDCeceRAwFYmhvAIdZEMxjg==', N'VGRTHWYR6UEO5TMEEUSF2R44SHC5W24L', N'fe1955af-2257-4c77-b361-0641667fbda0', N'0123123123', 0, 0, NULL, 1, 0, N'RootAdmin', 1)
GO
INSERT [dbo].[UserRole] ([UserId], [RoleId]) VALUES (N'b23c9573-fbef-4624-9b37-3915dcae7119', N'Manager')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20190619171802_updatedb', N'2.2.4-servicing-10062')
GO
SET IDENTITY_INSERT [dbo].[Vehicle] ON 
GO
INSERT [dbo].[Vehicle] ([Id], [CreatedAt], [UpdatedAt], [Deleted], [Name]) VALUES (1, CAST(N'2019-01-01T00:00:00.0000000' AS DateTime2), NULL, 0, N'Plane')
GO
INSERT [dbo].[Vehicle] ([Id], [CreatedAt], [UpdatedAt], [Deleted], [Name]) VALUES (2, CAST(N'2019-01-01T00:00:00.0000000' AS DateTime2), NULL, 0, N'Bus')
GO
INSERT [dbo].[Vehicle] ([Id], [CreatedAt], [UpdatedAt], [Deleted], [Name]) VALUES (3, CAST(N'2019-01-01T00:00:00.0000000' AS DateTime2), NULL, 0, N'Train')
GO
SET IDENTITY_INSERT [dbo].[Vehicle] OFF
GO
