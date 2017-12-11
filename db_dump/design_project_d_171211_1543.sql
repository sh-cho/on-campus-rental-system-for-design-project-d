-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- 생성 시간: 17-12-11 07:42
-- 서버 버전: 10.1.26-MariaDB
-- PHP 버전: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `design_project_d`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `classroom`
--

CREATE TABLE `classroom` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `classroom_rental`
--

CREATE TABLE `classroom_rental` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `classroom_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `rental_start_time` datetime NOT NULL,
  `rental_end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `classroom_rental_waiting`
--

CREATE TABLE `classroom_rental_waiting` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `classroom_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `rental_start_time` datetime NOT NULL,
  `rental_end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `uuid` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `equipment_rental`
--

CREATE TABLE `equipment_rental` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `rental_start_time` datetime NOT NULL,
  `rental_end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `equipment_rental_waiting`
--

CREATE TABLE `equipment_rental_waiting` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `rental_start_time` datetime NOT NULL,
  `rental_end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `fixture`
--

CREATE TABLE `fixture` (
  `id` int(11) NOT NULL,
  `classroom_id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `lecture`
--

CREATE TABLE `lecture` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `classroom_id` int(11) NOT NULL,
  `day_of_the_week` int(11) NOT NULL,
  `lecture_start_time` time NOT NULL,
  `lecture_end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `member`
--

CREATE TABLE `member` (
  `id` int(11) NOT NULL COMMENT '학번, 사번 등',
  `password` char(64) NOT NULL,
  `type` int(11) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `member`
--

INSERT INTO `member` (`id`, `password`, `type`, `email`) VALUES
(1234, '$2a$10$yA0qqc9hCSYAsH.UEcmuZegrhG5w23SJVPOxR0r3B27oWJIRk/itO', 1, 'a@a.a');

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `classroom`
--
ALTER TABLE `classroom`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `classroom_rental`
--
ALTER TABLE `classroom_rental`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `classroom_rental_waiting`
--
ALTER TABLE `classroom_rental_waiting`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `equipment_rental`
--
ALTER TABLE `equipment_rental`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `equipment_rental_waiting`
--
ALTER TABLE `equipment_rental_waiting`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `fixture`
--
ALTER TABLE `fixture`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `lecture`
--
ALTER TABLE `lecture`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `classroom`
--
ALTER TABLE `classroom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `classroom_rental`
--
ALTER TABLE `classroom_rental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `classroom_rental_waiting`
--
ALTER TABLE `classroom_rental_waiting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `equipment_rental`
--
ALTER TABLE `equipment_rental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `equipment_rental_waiting`
--
ALTER TABLE `equipment_rental_waiting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `fixture`
--
ALTER TABLE `fixture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `lecture`
--
ALTER TABLE `lecture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
