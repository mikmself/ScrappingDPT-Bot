CREATE DATABASE db;
USE db;
CREATE TABLE `dptonline` (
  `nik` varchar(255) NOT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `tps` varchar(255) DEFAULT NULL,
  `kecamatan` varchar(255) DEFAULT NULL,
  `kelurahan` varchar(255) DEFAULT NULL
);
